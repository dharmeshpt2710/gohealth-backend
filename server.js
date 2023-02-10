const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { log } = require("console");

var app = express();
app.get('/',function (req,res) {
    res.send("Hello World!");
    console.log("Successfully listened!");
});
var server = app.listen(3000,function () {
    
});