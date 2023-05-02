import { config } from "dotenv";
import { createServer } from "http";
import uuid from "uuid";

config();
const PORT = process.env.PORT;

interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const users: IUser[] = [
  {
    id: "1",
    username: "Alice",
    age: 2,
    hobbies: ["eat", "sleep"],
  },
];

createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  const { method, url } = request;
  if (method === "GET") {
    if (url === "/users") {
      response.statusCode = 200;
      return response.end(JSON.stringify(users));
    } else if (url?.startsWith("/users/")) {
      const requestId = url.replace("/users/", "");
      if (!uuid.validate(requestId)) {
        response.statusCode = 400;
        response.end("ID is not valid");
      } else if (!users.some((user) => user.id === requestId)) {
        response.statusCode = 404;
        response.end("User with this ID does not exist");
      }
    }
  }
}).listen(PORT);
