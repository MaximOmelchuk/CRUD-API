import cluster, { Worker } from "node:cluster";
import http from "node:http";
import { cpus } from "os";
import process, { env } from "node:process";
import { config } from "dotenv";
import { createServer } from "http";
import deleteHandler from "./methods/deleteHandler";
import getHandler from "./methods/getHandler";
import postHandler from "./methods/postHandler";
import putHandler from "./methods/putHandler";
import usersObject from "./usersObject";
import { IUser, IWorkersObj } from "./interfaces";

console.log(process.argv[2]?.slice(2));

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  let count = 1;
  config();
  const PORT = process.env.PORT || "8000";
  const workers: IWorkersObj = {};
  let users: IUser[] = [];

  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork({
      workerPort: `${+PORT + i}`,
      isMult: true,
    });
    workers[i] = worker;
    worker.on("message", (usersFromChild: IUser[]) => {
      users = usersFromChild;
    });
  }
  process.on("SIGINT", () => {
    Object.values(workers).forEach((worker) => {
      worker.kill();
    });
  });
  createServer((request, response) => {
    const { url, method } = request;
    const primaryChunkArr: Uint8Array[] = [];
    request.on("data", (chunk) => {
      primaryChunkArr.push(chunk);
    });
    request.on("end", () => {
      const fullDataPrimary = Buffer.concat(primaryChunkArr);
      const options = {
        method,
        hostname: "localhost",
        port: `${+PORT + count}`,
        path: url,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(fullDataPrimary),
        },
      };
      workers[count].send(users);
      if (count === numCPUs) {
        count = 1;
      } else {
        count++;
      }
      const req = http.request(options, (res) => {
        res.setEncoding("utf8");
      });
      req.write(fullDataPrimary);

      req.on("response", (res) => {
        const respChunkArr: string[] = [];
        res.on("data", (chunk) => {
          respChunkArr.push(chunk);
        });
        res.on("end", () => {
          response.setHeader("Content-Type", "application/json");
          response.statusCode = res.statusCode || 200;
          response.end(respChunkArr.join(""));
        });
      });
      req.end();
    });
  }).listen(PORT);
} else {
  const workerPort = process.env.workerPort;
  const isMult = !!process.env.isMult;
  let users: IUser[] = [];
  if (isMult) {
    process.on("message", (message: IUser[]) => {
      users = message;
    });
  }

  const server = createServer((request, response) => {
    console.log(workerPort);
    try {
      response.setHeader("Content-Type", "application/json");
      const { method, url } = request;
      const updateUsersCallback = (childUsers: IUser[]) => {
        if (process.send) process.send(childUsers);
      };

      if (method === "GET") {
        getHandler({ request, response, url, users, updateUsersCallback });
      } else if (method === "POST") {
        postHandler({ request, response, url, users, updateUsersCallback });
      } else if (method === "PUT") {
        putHandler({ request, response, url, users, updateUsersCallback });
      } else if (method === "DELETE") {
        deleteHandler({ request, response, url, users, updateUsersCallback });
      }
    } catch (err) {
      console.log(err);
      response.statusCode = 500;
      response.end("Error: unexpected server error");
    }
  });
  const runningServer = server.listen(workerPort);
}
