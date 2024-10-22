const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

main().catch((err) => console.error(err));

async function main() {
  await mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("Error connecting to MongoDB", err));
}
