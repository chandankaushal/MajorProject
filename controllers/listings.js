const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // Create Listing Form
  res.render("listings/create.ejs");
};

module.exports.showAllListings = async (req, res) => {
  const listingID = req.params.id;
  const listing = await Listing.findById(listingID)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.newListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  console.log("HELLO");
  console.log(`This is the owner${newListing.owner}`);
  await newListing.save();
  req.flash("success", "Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  let foundListing = await Listing.findById(id);
  if (!foundListing) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { foundListing });
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
