const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const { secret } = require("../config");
const User = require("../models/users");

const router = express.Router();

const verifyUserInputs = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Invalid fields" });
    return;
  }

  next();
};

const userIsAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/");
    return;
  }

  const user = jwt.verify(token, secret);
  if (!user) {
    res.clearCookie("token");
    res.redirect("/");
    return;
  }

  req.user = user;
  next();
};

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});

// router.post("/login", verifyUserInputs, async (req, res) => {
//   try {
//     let user = await User.findOne({ email: req.body.email });
//     console.log("Use=r=========>");
//     console.log(user);
//     if (!user) {
//       res.status(404).json({ message: "not found" });
//       return;
//     }

//     let passwordMatched = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     console.log("Password==========");
//     console.log(passwordMatched);

//     if (!passwordMatched) {
//       return res.status(404).json({ error: "User Not found" });
//     }
//     let userObj = {
//       name: user.name,
//       password: user.password,
//     };
//     const token = jwt.sign(userObj, secret, { expiresIn: "2h" });
//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 100000,
//     });
//     res.status(201).json({ message: "Logged In Successfully" });
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// });

let validateEmail = (email) => {
  let str = email.substr(email.length - 3);
  if (str != "com") {
    throw new Error("Domain has end with .com");
  }
  return true;
};

router.post(
  "/signup",
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .custom((val) => validateEmail(val)),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Atleast 5 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // let user = users.find(u => u.email == req.body.email)
      // if (user) {
      //     res.status(403).json({ message: "Already exists" })
      //     return
      // }
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password,
      });

      user
        .save()
        .then((result) => {
          return res.status(201).json(result);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
);

router.get("/edit", userIsAuthorized, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
