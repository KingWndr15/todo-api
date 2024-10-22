// packages import
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

// local import
require("./database/index");
require("./strategies/local");
require("dotenv").config();

// routes
const authRoute = require("./routes/auth");
const todoRoute = require("./routes/todo");

const app = express();

const PORT = process.env.PORT || 3000;
const corsOption = {
  origin: ["http://localhost:3000", "https://yourproductionurl.com"],
  methods: ["GET", "POST"],
  credentials: true,
};

// middleware setup
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(`${req.method}:${req.url}`);
  next();
});

// routes setup
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/todo", todoRoute);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running on http://localhost:${PORT}`);
  } else {
    console.error(`Error starting server: ${error.message}`);
  }
});

app.get("/", (req, res) => res.send({ message: "Hello, world!" }));
