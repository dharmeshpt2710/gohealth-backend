const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const { secret } = require("../config");
const User = require("../models/users");
const Doctor = require("../models/doctors");

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
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
});

router.post("/login", verifyUserInputs, async (req, res) => {
    try {
        let doctor = await Doctor.findOne({ email: req.body.email });
        console.log("docctor=========>");
        console.log(doctor);
        if (!doctor) {
            res.status(404).json({ message: "not found" });
            return;
        }

        let passwordMatched = await bcrypt.compare(
            req.body.password,
            doctor.password
        );
        console.log("Password==========");
        console.log(passwordMatched);

        if (!passwordMatched) {
            return res.status(404).json({ error: "User Not found" });
        }
        let doctorObj = {
            name: doctor.name,
            password: doctor.password,
        };
        const token = jwt.sign(doctorObj, secret, { expiresIn: "2h" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 100000,
        });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

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
            doctor = new Doctor({
                name: req.body.name,
                email: req.body.email,
                location: req.body.location,
                qualification: req.body.qualification,
                password,
                yearsOfExperience: req.body.yearsOfExperience,
                specialty: req.body.specialty
            });
            doctor
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
    res.status(200).json(req.doctor);
});

module.exports = router;
