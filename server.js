const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const server = require("http").createServer(app);
const DB = require("./config/DBConfig");
const verifyRoles = require("./middleware/verifyRoles");
const allowedRoles = require("./config/allowedRoles");
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => res.send("Main Page."));
app.use("/auth", require("./routes/auth"))
app.use("/user", verifyRoles(allowedRoles.User), require("./routes/user"));
app.use("/store", verifyRoles(allowedRoles.Store), require("./routes/admin"));
app.use("/founder", verifyRoles(allowedRoles.Founder), require("./routes/founder"));
app.use("*", (req, res) => res.status(404).send("Page Not Found"));

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
