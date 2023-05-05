import { config } from "dotenv";
import { createServer } from "http";
import deleteHandler from "./methods/deleteHandler";
import getHandler from "./methods/getHandler";
import postHandler from "./methods/postHandler";
import putHandler from "./methods/putHandler";

config();
const PORT = process.env.PORT;

const server = createServer((request, response) => {
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
const runningServer = server.listen(PORT);

export { runningServer, server };
