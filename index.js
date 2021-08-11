const express = require("express");
const app = express();
const genres = require("./routes/genres");
const home = require("./routes/home");
require("dotenv").config();

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});

app.use("/api/genres", genres);
app.use("/", home);
