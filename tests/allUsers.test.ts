import request from "supertest";
import { server as serverInstance, runningServer } from "../src";
import { describe, expect, test, it, afterAll, beforeAll } from "@jest/globals";
import http from "http";
import supertest from "supertest";

// import { describe, it } from "node:test";
// import assert from "node:assert/strict";
// import { expect } from "expect";
// import http from "http";
// const PORT = process.env.PORT || 8000;
// const mockedServer = request(app);
// console.log(typeof app);
// const server = request(serverInstance);
// afterAll(async () => {

// })
const server = supertest(serverInstance);
describe("Testing GET all users request", () => {
  afterAll((done) => {
    runningServer.close();
    done();
  });

  it("get all users", async () => {
    await server.get("/api/users").then((response) => {
      expect(response.body).toEqual([]);
    });

    // .on("response", (response) => {
    //   const respChunkArr: string[] = [];
    //   response.on("data", (chunk) => {
    //     respChunkArr.push(chunk);
    //   });
    //   response.on("end", () => {
    //     expect(response.statusCode).toBe(200);
    //     expect(respChunkArr.join("")).toBe("[]");
    //   });
    // })
    // .end();
    // request(app)
    //   .get("http://localhost:8000/api/users")
    //   .then((response) => {
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toBe("[s]");
    //   })
    //   .catch((e) => {});
    // server
    //   .get("http://localhost:8000/api/users", async (response) => {
    //     const respJSON = await response.json();
    //   })
    //   .end(() => serverInstance.close());
    // expect(response.statusCode).toBe(210);
  });
  it("get all users2", async () => {
    // server
    //   .get("http://localhost:8000/api/users", (response) => {
    //     expect(response.statusCode).toBe(200);
    //   })
    //   .end(() => serverInstance.close());
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
