const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
require("../db/connectDb");
const authenticate = require("../middlewears/authenticate");


const verifyToken = (req, res, next) => {
  const token = req.cookies.jwtoken;

  try {
    const verifyToken = jwt.verify(token, process.env.SEC_KEY);
    req.user = verifyToken;
    next();
  } catch (error) {
    res.status(401).json({ error: error });
  }
};








router.get("/", (req, res) => {
  res.cookie("jwt", "helloji");

  res.send("Hello Server from auth");
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    res.status(422).json({ error: "404 error" });
  }

  try {
    const userExsist = await User.findOne({ email: email });

    if (userExsist) {
      return res.status(422).json({ error: "User Already Exists" });
    }
    const user = new User({ name, email, phone, work, password, cpassword });

    const userRegister = await user.save();
    if (userRegister) {
      res.status(201).json({ message: "Sign Up Done !" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  if (!email || !password) {
    res.status(422).json({ error: "404 error" });
  }

  try {
    const userExsist = await User.findOne({ email: email });
    if (userExsist) {
      const verifyPass = await bcrypt.compare(password, userExsist.password);
      const token = jwt.sign({ _id: userExsist._id }, process.env.SEC_KEY);
      res.cookie("jwtoken", token, { maxAge: 60 * 60 * 24 });

      console.log("This Is Token   -----  >>>>>> " + token);

      if (!verifyPass) {
        res.status(422).json({ password: "Invalid Details" });
      } else {
        res
          .status(200)
          .json({ login: `Log In Successfull , Hello ${userExsist.name}` });
      }
    } else {
      res.status(422).json({ password: "Invalid Details" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/myprofile",verifyToken, (req, res) => {
  res.status(200).send("hello");
});

module.exports = router;
