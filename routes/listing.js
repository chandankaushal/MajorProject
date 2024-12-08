const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Verify if the user is logged in
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { checkCloudinaryAuth } = require("../cloudConfig.js"); //Check If Cloudinary is successfully Authenticated

const listingController = require("../controllers/listings");

router.route("/search").get(wrapAsync(listingController.searchListing)); //Search Listing

router
  .route("/")
  .get(wrapAsync(listingController.index)) //Show All Listings
  .post(
    isLoggedIn,
    checkCloudinaryAuth,
    upload.single("listing[image][file]"), //Uploading the File
    validateListing,
    wrapAsync(listingController.newListing)
  ); //Create New Listing

router.get("/new", isLoggedIn, listingController.renderNewForm); // Renders Form to create New Listing.

router
  .route("/:id")
  .get(wrapAsync(listingController.showListinByID)) //Show Listing
  .put(
    //Update Listing
    isLoggedIn,
    isOwner,
    checkCloudinaryAuth,
    upload.single("listing[image][file]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //Delete Lisitng

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
