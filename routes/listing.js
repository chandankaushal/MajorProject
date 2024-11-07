const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js"); // Custom Error
const listingSchema = require("../schema.js"); //validateListingSchema Joi
const { isLoggedIn } = require("../middleware.js"); // Verify if the user is logged in

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

router.get("/new", isLoggedIn, (req, res) => {
  // Create Listing Form
  res.render("listings/create.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const listingID = req.params.id;
    const listing = await Listing.findById(listingID).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    }
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
    req.flash("success", "Listing Added Successfully");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log("In Edit Function");
    let foundListing = await Listing.findById(id);
    console.log("Listing Found!");
    if (!foundListing) {
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    }
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
    req.flash("success", "Listing Updated Successfully");
    res.redirect("/listings");
  })
);

//Delete Route

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
