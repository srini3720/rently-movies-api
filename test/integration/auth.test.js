const request = require("supertest");
const { Genres } = require("../../models/genres");
const { User } = require("../../models/users");

describe("Auth genre", () => {
  beforeAll(async () => {
    (server = require("../../index")), await server.close();
  });
  afterAll(async () => {
    (server = require("../../index")), await server.close();
  });
  beforeEach(() => {
    (server = require("../../index")), (token = new User().generateAuthToken());
  });
  afterEach(async () => {
    await server.close(), await Genres.remove({});
  });
  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  it("should retun 401 if invalid token is given", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });
  it("should retun 400 if invalid token is given", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should retun 200 if valid token is given", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
