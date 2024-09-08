const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const port = 8080;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My Home",
//     descripton: "By the beach",
//     price: 1200,
//     location: "New York",
//     Country: "USA",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful Testing");
// });

app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
  }
});

app.get("/listings/:id", async (req, res) => {
  const listingID = req.params.id;
  //console.log(listingID.id);

  const listing = await Listing.findById(listingID);
  console.log(listing);
  res.render("listings/show.ejs", { listing });

  //res.send("SHOW");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
