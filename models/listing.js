const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const defaultImage =
  "https://images.unsplash.com/photo-1725489890999-84e4f2f71327?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: defaultImage, // If no link k:v passed then default value
      set: (v) => (v === "" ? defaultImage : v),
    },
  }, //Ternary Operator if link is passed and is empty then insert default image
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
