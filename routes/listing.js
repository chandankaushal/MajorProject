const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Verify if the user is logged in

const listingController = require("../controllers/listings");

router
  .route("/")
  .get(wrapAsync(listingController.index)) //Show All Listings
  .post(isLoggedIn, validateListing, wrapAsync(listingController.newListing)); //Create New Listing

//Create Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListinByID)) //Show Listing
  .put(
    //Update Listing
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //Delete Listing

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
