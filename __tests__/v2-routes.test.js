"use strict";
require("dotenv").config();
const server = require("../src/server").server;
require("@code-fellows/supergoose");
const supertest = require("supertest");
const fakeServer = supertest(server);
let clothes = {
  name: "Shirt",
  color: "BLUE",
  size: "X-large",
};
let user = {
  username: "fakeUser",
  password: "0000",
  role: "admin",
};
describe("V2", () => {
  it("POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item", async () => {
    let siginUp = await fakeServer.post("/signup").send(user);
    let siginIn = await fakeServer
      .post("/signin")
      .auth(user.username, user.password);
    let token = ` Bearer ${siginIn.body.token}`;
    let test = await fakeServer
      .post("/api/v2/clothes")
      .set(`Authorization`, token)
      .send(clothes);
    expect(test.body.color).toEqual("BLUE");
    expect(test.status).toEqual(201);
  });
  it("GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items", async () => {
    let siginIn = await fakeServer
      .post("/signin")
      .auth(user.username, user.password);
    let token = `Bearer ${siginIn.body.token}`;
    let test = await fakeServer
      .get("/api/v2/clothes")
      .set(`Authorization`, token);
    expect(test.body[0].name).toEqual("Shirt");
    expect(test.status).toEqual(200);
  });
  it("GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID", async () => {
    let siginIn = await fakeServer
      .post("/signin")
      .auth(user.username, user.password);
    let token = `Bearer ${siginIn.body.token}`;
    let postSomething = await fakeServer
      .post("/api/v2/clothes")
      .set(`Authorization`, token)
      .send(clothes);
    let id = postSomething.body._id;
    let testGEtById = await fakeServer
      .get(`/api/v2/clothes/${id}`)
      .set(`Authorization`, token);
    expect(testGEtById.status).toEqual(200);
    expect(testGEtById.text).toBeDefined();
  });
  it("PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID", async () => {
    let siginIn = await fakeServer
      .post("/signin")
      .auth(user.username, user.password);
    let token = `Bearer ${siginIn.body.token}`;
    let postSomething = await fakeServer
      .post("/api/v2/clothes")
      .set(`Authorization`, token)
      .send(clothes);
    let id = postSomething.body._id;
    let updated = {
      name: "Shirt",
      color: "BLUE",
      size: "Small",
    };
    let updateSomething = await fakeServer
      .put(`/api/v2/clothes/${id}`)
      .set(`Authorization`, token)
      .send(updated);
    expect(updateSomething.status).toEqual(200);
    expect(updateSomething.body.size).toEqual("Small");
  });
  it("DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found", async () => {
    let siginIn = await fakeServer
      .post("/signin")
      .auth(user.username, user.password);
    let token = `Bearer ${siginIn.body.token}`;
    let postSomething = await fakeServer
      .post("/api/v2/clothes")
      .set(`Authorization`, token)
      .send(clothes);
    let id = postSomething.body._id;
    let Todelete = await fakeServer
      .delete(`/api/v2/clothes/${id}`)
      .set(`Authorization`, token);
    let testGEtById = await fakeServer
      .get(`/api/v2/clothes/${id}`)
      .set(`Authorization`, token);
    expect(Todelete.status).toEqual(200);
    expect(Todelete.data).not.toBeDefined();
    expect(testGEtById.body).toBeNull();
  });
});
