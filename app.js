const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { stat } = require("fs");

const port = 8080;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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
  res.redirect("/listings");
});

//Index Route

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
  })
);
//Create Route

app.get("/listings/new", (req, res) => {
  res.render("listings/create.ejs");
});

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const listingID = req.params.id;
    const listing = await Listing.findById(listingID);

    res.render("listings/show.ejs", { listing });
  })
);

//New Route

app.post(
  "/listings",

  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "Page not found");
    }

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let foundListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { foundListing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let editedListing = req.body.listing;

    let dbListing = await Listing.findByIdAndUpdate(
      //Update DB listing with edited Listing
      id,
      { ...editedListing },
      { runValidators: true }
    );
    res.redirect("/listings");
  })
);

//Delete Route

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).send(message);
  console.log(statusCode, message);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
