import request from "supertest";
import { runningServer as app, server as serverInstance } from "../src";
import { describe, expect, test, it, afterAll, beforeAll } from "@jest/globals";
import http from "http";

// import { describe, it } from "node:test";
// import assert from "node:assert/strict";
// import { expect } from "expect";
// import http from "http";
// const PORT = process.env.PORT || 8000;
// const mockedServer = request(app);
// console.log(typeof app);
const server = request(app);
describe("Testing GET all users request", () => {
  it("get all users", async () => {
    server
      .get("http://localhost:8000/api/users", (response) => {
        expect(response.statusCode).toBe(200);
      })
      .end(() => serverInstance.close());

    // expect(response.statusCode).toBe(210);
  });
  it("get all users2", async () => {
    server
      .get("http://localhost:8000/api/users", (response) => {
        expect(response.statusCode).toBe(200);
      })
      .end(() => serverInstance.close());

    // expect(response.statusCode).toBe(210);
  });
});
//   await it("respond with correst status and data", async () => {
//     http.get(`http://localhost:${PORT}`, async (res) => {
//       request(server).get("api/userssds", (response) => {
//         expect(response.status).toBe(200);
//         expect(response.body.status).toBe("success");
//         expect(response.body.message).toBe("[sdsdsdsd");
//       });

//       //   console.log(response);
//     });
//     // const response = await request(server).get("api/users");
//     // console.log(response);
//     // .send({
//     //   title: "How to write a answer",
//     //   body: "Access the Educative answer tutorial",
//     // });

//     // console.log(response);
//   });
// });
