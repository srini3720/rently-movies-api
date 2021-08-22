const request = require("supertest");
const { Genres } = require("../../models/genres");
const { User } = require("../../models/users");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  beforeAll(async () => {
    (server = require("../../index")), await server.close();
  });
  afterAll(async () => {
    (server = require("../../index")), await server.close();
  });
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close(), await Genres.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return genre with given id", async () => {
      const genre = await new Genres({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id is given", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
    it("should return 404 if valid id is given but not in database", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 character", async () => {
      name = "aaaa";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is greater than 50 character", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should save genre if it is valid", async () => {
      const res = await exec();
      const genre = await Genres.find({ name: "genre1" });

      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });
    it("should return genre if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
  describe("PUT /", () => {
    let token;
    let newName;
    let id;
    let genre;

    const exec = () => {
      return request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };
    beforeEach(async () => {
      genre = new Genres({ name: "genre" });
      await genre.save();

      token = new User().generateAuthToken();
      newName = "newgenre";
      id = genre._id;
    });
    it("should return 401 if token is not given", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 if invalid token is given", async () => {
      token = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 500 if invalid id is given", async () => {
      id = 123456;
      const res = await exec();

      expect(res.status).toBe(500);
    });
    it("should return 404 if valid id is given but not in database", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("shoule return 404 if new genre is less than 5 character", async () => {
      newName = "aaa";
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("shoule return 400 if new genre is less than 5 character", async () => {
      newName = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("should update genre if it is valid", async () => {
      await exec();
      const updateGenre = await Genres.findById(genre._id);

      expect(updateGenre.name).toBe(newName);
    });
    it("should retun updated genre if it is valid", async () => {
      res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });
  describe("DELETE /", () => {
    let token;
    let genre;
    let id;
    const exec = function () {
      return request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };
    beforeEach(async () => {
      genre = new Genres({ name: "gener1" });
      await genre.save();

      token = new User({ isAdmin: true }).generateAuthToken();
      id = genre._id;
    });
    it("should return 401 if token is not given", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if invalid token is given", async () => {
      token = "a";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 403 if invalid token is given", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return 500 if invalid id is given", async () => {
      id = "a";
      const res = await exec();
      expect(res.status).toBe(500);
    });
    it("should return 404 if invalid id is given", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should delete genre if valid id is given", async () => {
      await exec();
      const genereInDatabase = await Genres.findById(genre._id);

      expect(genereInDatabase).toBeNull();
    });
    it("should retun deleted genre in body of response", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("deletedCount", 1);
      expect(res.body).toHaveProperty("ok", 1);
    });
  });
});
