const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const port = 8080;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connection to Db successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route

app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
  }
});
//Create Route

app.get("/listings/new", (req, res) => {
  res.render("listings/create.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  const listingID = req.params.id;
  const listing = await Listing.findById(listingID);

  res.render("listings/show.ejs", { listing });
});

//New Route

app.post("/listings", async (req, res) => {
  let { title, description, price, location, country, imageLink } = req.body;

  try {
    const listing1 = new Listing({
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
      image: { filename: "", url: imageLink },
    });

    await listing1.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  try {
    let foundListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { foundListing });
  } catch (err) {
    console.log(err);
  }
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;

  let editedListing = req.body.listing;

  try {
    let dbListing = await Listing.findByIdAndUpdate(
      //Update DB listing with edited Listing
      id,
      { ...editedListing },
      { runValidators: true }
    );
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
