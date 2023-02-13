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
app.use(express.json());
app.use(cookieParser());

console.log("2");
app.use("/api/users", userRouter);
mongoose.set("strictQuery", false);
mongoose.connect(dbUri, {
}).then((res) => {
    app.listen(port, () => {
        console.log("Server is running on", port);
    });
}).catch((err) => {
    console.log(err);
});
