const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(cookieParser());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your React app's URL
    optionsSuccessStatus: 200,
    credentials: true, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

require("./db/connectDb");
app.use(express.json())
const User = require('./models/userSchema');

app.use(require('./router/auth'));

app.listen(process.env.PORT, () => {
  console.log(`Server Start At Port ${process.env.PORT}`);
});
