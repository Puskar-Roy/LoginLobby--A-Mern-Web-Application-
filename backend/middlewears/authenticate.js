const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SEC_KEY, {
      ignoreExpiration: false,
    });

    if (!verifyToken) {
      throw new Error("Invalid Token");
    }

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User Not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authenticate;
