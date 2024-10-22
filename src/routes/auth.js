const { Router } = require("express");
const passport = require("passport");
const userSchema = require("../database/schema/User.js");
const { hashPassword, comparePassword } = require("../utils/helper.js");

const router = Router();

router.get("/", (req, res) => {
  console.log(req.cookie);
  res.sendStatus(200);
});

router.post("/signup", async (req, res) => {
  const { email } = req.body;
  if (!email || !req.body.password) {
    return res.status(400).json({ error: "Missing credentials!" });
  }
  const userDB = await userSchema.findOne({ email });
  if (userDB) return res.status(409).json({ error: "User already exists!" });
  const password = await hashPassword(req.body.password);
  const newUser = await userSchema.create({ email, password }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Internal server error!" });
  });

  console.log("User created successfully!");
  res.sendStatus(201);
});

// router.post("/login", async (req, res) => {
//   const { email } = req.body;
//   if (!email || !req.body.password) {
//     return res.status(400).json({ error: "Missing credentials!" });
//   }
//   const userDB = await userSchema.findOne({ email });
//   if (!userDB) return res.status(401).json({ error: "User does not exist!" });
//   const password = await comparePassword(req.body.password, userDB.password);
//   if (!password) {
//     return res.status(401).json({ error: "Incorrect password!" });
//   }
//   res.send({ message: "Logged in Successful!" }).status(202);
// });

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Log in Successful!");
  res.cookie("visited", true, { maxAge: 3600000 });
  res.status(200).send({ message: "Logged in Successfully!" });
});
  
module.exports = router;
