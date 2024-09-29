const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js"); // Custom Error
const listingSchema = require("../schema.js"); //validateListingSchema Joi

const validateListing = (req, res, next) => {
  //Validate Listing using Joi (schema.js) using this as middleWare
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(","); // Error.details is an array. Extracting message from it and creating new array and then joining that array separated by , to create new string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  //Show All Listings
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
  })
);
//Create Route

router.get("/new", (req, res) => {
  // Create Listing Form
  res.render("listings/create.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const listingID = req.params.id;
    const listing = await Listing.findById(listingID).populate("reviews");

    res.render("listings/show.ejs", { listing });
  })
);

//New Route

router.post(
  // Create New Listing
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let foundListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { foundListing });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing,
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

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
