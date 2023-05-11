import request from "supertest";
import { server as serverInstance, runningServer } from "../src";
import { describe, expect, test, it, afterAll, beforeAll } from "@jest/globals";
import http from "http";
import supertest from "supertest";
import { validate } from "uuid";

const dummyUser = {
  username: "Alice",
  age: 2,
  hobbies: ["eat", "sleep"],
};

const server = supertest(serverInstance);

describe("GET all users request", () => {
  afterAll((done) => {
    runningServer.close();
    done();
  });

  it("should response with code 200", async () => {
    await server.get("/api/users").then((response) => {
      expect(response.statusCode).toBe(200);
    });
  });
  it("should return []", async () => {
    await server.get("/api/users").then((response) => {
      expect(response.body).toEqual([]);
    });
  });
});

describe("POST new user", () => {
  afterAll((done) => {
    runningServer.close();
    done();
  });

  it("should return correct user data", async () => {
    await server
      .post("/api/users")
      .send(dummyUser)
      .then((response) => {
        expect(response.body.username).toBe("Alice");
        expect(response.body.age).toBe(2);
        expect(response.body.hobbies).toEqual(["eat", "sleep"]);
      });
  });
  // it("should create valid user id", async () => {
  //   await server.post("/api/users").send(dummyUser);
  //   // .then((response) => {
  //   //   expect(validate(response.body.id)).toBeTruthy();
  //   // });
  // });
});

describe("GET one user", () => {
  afterAll((done) => {
    runningServer.close();
    done();
  });

  it("should return correct user data", async () => {
    const createResponse = await server.post("/api/users").send(dummyUser);
    const id = createResponse.body.id;
    await server.get(`/api/users/${id}`).then((response) => {
      expect(response.body.username).toBe(dummyUser.username);
      expect(response.body.age).toBe(dummyUser.age);
      expect(response.body.hobbies).toEqual(dummyUser.hobbies);
    });
  });

  it("should response with code 400 if is is not valid", async () => {
    await server.post("/api/users").send(dummyUser);
    const id = "1111";
    await server.get(`/api/users/${id}`).then((response) => {
      expect(response.statusCode).toBe(400);
    });
  });
});
