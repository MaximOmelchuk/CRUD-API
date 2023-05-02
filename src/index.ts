import { config } from "dotenv";
import { createServer } from "http";
import { v4, validate } from "uuid";
import checkIsReceivedUserValid from "./utils";

config();
const PORT = process.env.PORT;

interface IRequestUser {
  username: string;
  age: number;
  hobbies: string[];
}

interface IUser extends IRequestUser {
  id: string;
}

const users: IUser[] = [
  // {
  //   id: "1",
  //   username: "Alice",
  //   age: 2,
  //   hobbies: ["eat", "sleep"],
  // },
];

createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  const { method, url } = request;

  if (method === "GET") {
    if (url === "/users") {
      response.statusCode = 200;
      return response.end(JSON.stringify(users));
    } else if (url?.startsWith("/users/")) {
      const requestId = url.replace(/^\/users\//, "");
      if (!validate(requestId)) {
        response.statusCode = 400;
        return response.end("ID is not valid");
      }
      const user = users.find((user) => user.id === requestId);
      if (!user) {
        response.statusCode = 404;
        return response.end("User with this ID does not exist");
      }
      response.statusCode = 200;
      return response.end(JSON.stringify(user));
    }
  }

  if (method === "POST") {
    if (url === "/users") {
      let chunkArr: Uint8Array[] = [];
      request.on("data", (chunk) => {
        chunkArr.push(chunk);
      });
      request.on("end", () => {
        const fullResponseUserData = Buffer.concat(chunkArr).toString();
        const responseData: IRequestUser = JSON.parse(fullResponseUserData);
        if (checkIsReceivedUserValid(responseData)) {
          const userData: IUser = { id: v4(), ...responseData };
          users.push(userData);
          response.statusCode = 201;
          return response.end(JSON.stringify(userData));
        } else {
          response.statusCode = 400;
          return response.end("User should contain all required fields");
        }
      });
    }
  }
}).listen(PORT);
