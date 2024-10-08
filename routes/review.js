const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const reviewSchema = require("../reviewSchema.js"); // Joi Schema to validate reviews
const ExpressError = require("../utils/ExpressError.js"); // Custom Error
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Error.details is an array. Extracting message from it and creating new array and then joining that array separated by , to create new string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Review Route

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { rating, comment } = req.body.review; // Review Contents
    let { id } = req.params; // Lising ID

    //Creating a new review
    let newReview = new Review({
      comment: comment,
      rating: rating,
    });
    const result = await Listing.findById(id);

    result.reviews.push(newReview); //Pushing newReview
    await newReview.save(); //Saving in Review DB
    await result.save(); //Saving Listing with Review in DB

    res.redirect(`/listings/${id}`);
  })
);

//Delete Review Route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let result = await Review.findByIdAndDelete(reviewId);

    let listingResult = await Listing.findById(id);

    let pullResult = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }, //$pull will delete the array items that match the condition
    });

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
