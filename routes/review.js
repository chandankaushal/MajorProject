const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewOwner,
} = require("../middleware.js");

//Review Route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { rating, comment } = req.body.review; // Review Contents
    let { id } = req.params; // Lising ID
    let thisUser = req.user._id;

    //Creating a new review
    let newReview = new Review({
      comment: comment,
      rating: rating,
      author: thisUser,
    });
    const result = await Listing.findById(id);

    result.reviews.push(newReview); //Pushing newReview
    await newReview.save(); //Saving in Review DB
    await result.save(); //Saving Listing with Review in DB
    req.flash("success", "Review Added Successfully");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Review Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let result = await Review.findByIdAndDelete(reviewId);

    let listingResult = await Listing.findById(id);

    let pullResult = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }, //$pull will delete the array items that match the condition
    });
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
