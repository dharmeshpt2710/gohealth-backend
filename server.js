const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { port, dbUri } = require("./config");
const userRouter = require("./routes/users");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
console.log("1");
app.use(express.json());
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.status(200).render("index", {
//     message: "success",
//   });
// });
console.log("2");
app.use("/api/users", userRouter);
console.log("URLS_________");
console.log(dbUri);
mongoose.connect(dbUri, {
  })
  .then((res) => {
    console.log("Connection----");
    app.listen(port, () => {
      console.log("Server is running on", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
