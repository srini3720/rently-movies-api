const auth = require("../../../middleware/auth");
const { User } = require("../../../models/users");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with payload of valid jwt", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    token = new User(user).generateAuthToken();
    req = {
      header: jest.fn().mockReturnValue(token),
    };
    res = {};
    next = jest.fn();
    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  });
});
