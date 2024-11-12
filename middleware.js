const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
  next(); // Call next() to move to the next middleware/route handler if authenticated
};

module.exports.redirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let foundListing = await Listing.findById(id);
  if (!foundListing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  //Validate Listing using Joi (schema.js) using this as middleWare
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(","); // Error.details is an array. Extracting message from it and creating new array and then joining that array separated by , to create new string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Error.details is an array. Extracting message from it and creating new array and then joining that array separated by , to create new string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;

  let foundReview = await Review.findById(reviewId);

  if (!foundReview.author.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
