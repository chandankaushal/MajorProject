const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // Custom Error
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const port = 8080;

let sessionOptions = { secret: 'keyboard cat',resave: false,saveUninitialized: true, cookie:{
  expires: Date.now() + (86400*1000*7),
  maxAge: 86400*1000*7,
  httpOnly: true
}}

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // Connecting to Mongo DB
main()
  .then(() => {
    console.log("Connection to Db successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  //Home Page
  res.render("home.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
