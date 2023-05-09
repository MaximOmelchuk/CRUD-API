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

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  let count = 1;
  config();
  const PORT = process.env.PORT || "8000";
  const workers: Worker[] = [];

  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork({ workerPort: `${+PORT + i}` });
    workers.push(worker);
  }

  createServer((request, response) => {
    const { url, method } = request;
    const primaryChunkArr: Uint8Array[] = [];
    request.on("data", (chunk) => {
      primaryChunkArr.push(chunk);
    });
    request.on("end", () => {
      console.log("====================================");
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
      let workerChunkArr: Uint8Array[] = [];
      const req = http.request(options, (res) => {
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          workerChunkArr.push(chunk);
        });
      });
      req.write(fullDataPrimary);

      req.on("response", (res) => {
        const respChunkArr: string[] = [];
        res.on("data", (chunk) => {
          console.log(chunk, "====chunk");
          respChunkArr.push(chunk);
        });
        res.on("end", () => {
          response.end(respChunkArr.join(""));
        });
      });
      req.end();
    });
  }).listen(PORT);

  // cluster.on("exit", (worker, code, signal) => {
  //   console.log(`worker ${worker.process.pid} died`);
  // });
} else {
  const workerPort = process.env.workerPort;

  const server = createServer((request, response) => {
    console.log(workerPort);
    try {
      response.setHeader("Content-Type", "application/json");
      const { method, url } = request;

      if (method === "GET") {
        return getHandler({ request, response, url });
      }
      if (method === "POST") {
        return postHandler({ request, response, url });
      }
      if (method === "PUT") {
        return putHandler({ request, response, url });
      }
      if (method === "DELETE") {
        return deleteHandler({ request, response, url });
      }
    } catch (err) {
      console.log(err);
      response.statusCode = 500;
      response.end("Error: unexpected server error");
    }
  });
  const runningServer = server.listen(workerPort);
}
