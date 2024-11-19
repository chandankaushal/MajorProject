const Listing = require("../models/listing");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // Create Listing Form
  // console.log(req.body);
  res.render("listings/create.ejs");
};

module.exports.showListinByID = async (req, res) => {
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
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  await newListing.save();
  req.flash("success", "Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  console.log(req.body);
  console.log(`This is request params ${id}`);

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
