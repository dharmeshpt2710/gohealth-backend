const express = require("express");

const { secret } = require("../config");
const User = require("../models/users");

const router = express.Router();



router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});


module.exports = router;
