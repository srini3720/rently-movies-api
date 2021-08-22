const { Rentals } = require("../../models/rentals");
const { User } = require("../../models/users");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const { Movies } = require("../../models/movies");

describe("/api/returns", () => {
  afterAll(async () => {
    (server = require("../../index")), await server.close();
  });
  beforeAll(async () => {
    (server = require("../../index")), await server.close();
  });
  let server;
  let movieId;
  let customerId;
  let token;
  let movie;

  const exec = function () {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId: customerId, movieId: movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movies({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: mongoose.Types.ObjectId(),
      numberInstock: 10,
    });
    await movie.save();
    rental = new Rentals({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close(), await Rentals.remove({}), await Movies.remove({});
  });

  it("should return 401 if  user not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });
  it("should return 400 if  customerId is not given", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if  movieId is not given", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 404 if  rental is inavlid for movie/customer", async () => {
    await Rentals.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });
  it("should return 400 if  rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 200 if  is valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
  it("should return rental or (200) difference if  is valid request", async () => {
    const res = await exec();

    // const rentalIndb = await Rentals.findById(rental._id);
    const timeDiff = res.body.dateReturned - new Date();
   
    // console.log(timeDiff);
    // expect(timeDiff).toBeLessThanOrEqual(10 * 1000);

    expect(res.status).toBe(200);
  });
  it("should set rental fee or (200) if input is valid request", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();

    // const rentalInDb = await Rentals.findById(rental._id);

    expect(res.body.rentalFee).toBe(14);
    expect(res.status).toBe(200);
  });
  it("should increase movie stock or (200)if input is valid request", async () => {
    const res = await exec();

    const movieInDb = await Movies.findById(res.body.movie._id);

    // expect(movieInDb.numberInstock).toBe(movie.numberInstock + 1);
    expect(res.status).toBe(200);
  });
  it("should return rental if input is valid request", async () => {
    const res = await exec();

    const rentalInDb = await Rentals.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
