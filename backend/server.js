const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const recipesRoutes = require("./routes/recipes");
const usersRoutes = require("./routes/users");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AuthMiddleware = require("./middlewares/AuthMiddleware");
const cron = require("node-cron");
const User = require("./models/User");
const sendEmail = require("./helpers/sendEmail");

const app = express();
app.use(express.static("public"));
const mongoURL =
  "mongodb+srv://nine122:test1234@mern.snazmzi.mongodb.net/?retryWrites=true&w=majority&appName=Mern";
mongoose.connect(mongoURL).then(() => {
  console.log("connected to db");
  app.listen(process.env.PORT, () => {
    console.log("app is running on localhost:" + process.env.PORT);
    cron.schedule("*/4 * * * * *", async () => {
      let user = await User.findByIdAndUpdate("6606c41539c9b946de4c5e41", {
        name: "mgmg " + Math.random(),
      });
    });
  });
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); //local development --WARNING---
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

app.use("/api/recipes", AuthMiddleware, recipesRoutes);
app.use("/api/users", usersRoutes);

app.get("/set-cookie", (req, res) => {
  // res.setHeader('Set-Cookie','name=hlaingminthan');
  res.cookie("name", "aungaung");
  res.cookie("important-key", "value", { httpOnly: true });
  return res.send("cookie already set");
});

app.get("/send-email", async (req, res) => {
  try {
    await sendEmail({
      view: "test",
      data: {
        name: "AungAung",
      },
      from: "mgmg@gmail.com",
      to: "aungaung@gmail.com",
      subject: "Hello AungAung",
    });
    return res.send("email already sent");
  } catch (e) {
    return res.status(500).json({
      message: e.message,
      status: 500,
    });
  }
});

app.get("/get-cookie", (req, res) => {
  let cookies = req.cookies;
  return res.json(cookies);
});
