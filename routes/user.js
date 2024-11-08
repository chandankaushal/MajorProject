const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectURL } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      await User.register(newUser, password);

      req.login(newUser, (err) => {
        if (err) {
          console.log(
            "There was an error logging in the new User after signup"
          );
          return next(err);
        }
        req.flash("success", "You have signed up! Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  redirectURL,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    //req.flash("success", "Welcome to Wanderlust!");
    req.flash("success", "Welcome to Wanderlust! You are Logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You have been Logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
