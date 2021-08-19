const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should generate token and verify", () => {
    payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    expect(decoded).toMatchObject(payload);
  });
});
