const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const server = require("http").createServer(app);
const DB = require("./config/DBConfig");

app.use(cors());
app.use(express.json());

app.get("/", (res) => res.send("Welcome!"));
app.use("/auth", require("./routes/auth"));
app.get("*", (res) => res.send("404 PAGE NOT FOUND"));

DB()
  .then((connect) => {
    server.listen(port, () => {
      console.log(
        `Server running on port ${port} & Database ${connect.connection.host}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
