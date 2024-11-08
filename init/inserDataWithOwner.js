const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connection to Db successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  let newData = initData.data.map((el) => {
    return { ...el, owner: "672de98d45eac60dd05fee95" }; //Adding Owner
  });
  await Listing.insertMany(newData); //Inserting New Data with Owner
  console.log("New Data with Owner was Inserted");
};
initDB();
