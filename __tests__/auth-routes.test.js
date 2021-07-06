const supergoose = require("@code-fellows/supergoose");
const server = require("../src/server");
const request = supergoose(server.server);

require("dotenv").config();

let users = {
  admin: { username: "admin", password: "password", role: "admin" },
  editor: { username: "editor", password: "password", role: "editor" },
  user: { username: "user", password: "password", role: "user" },
};

describe("Auth Tests", () => {
  Object.keys(users).forEach((userType) => {
    test("properly signs up for user", async () => {
      const response = await request.post("/signup").send(users[userType]);
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user._id).toBeDefined();
      expect(response.body.user.username).toEqual(users[userType].username);
    });
    test("properly signs in the user", async () => {
      const response = await request
        .post("/signin")
        .auth(users[userType].username, users[userType].password);
      expect(response.body.user._id).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toEqual(users[userType].username);
      expect(response.status).toBe(200);
    });
  });
});
