const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connection to Db successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My Home",
    descripton: "By the beach",
    price: 1200,
    location: "New York",
    Country: "USA",
  });

  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Successful Testing");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
