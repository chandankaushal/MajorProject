const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Verify if the user is logged in

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
    const listing = await Listing.findById(listingID)
      .populate("reviews")
      .populate("owner");
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
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    console.log("HELLO");
    console.log(`This is the owner${newListing.owner}`);
    await newListing.save();
    req.flash("success", "Listing Added Successfully");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let foundListing = await Listing.findById(id);
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
  isLoggedIn,
  isOwner,
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
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
