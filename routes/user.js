const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectURL } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignUpForm) //Signup Form
  .post(wrapAsync(userController.createUser)); //Signup Function

router
  .route("/login")
  .get(userController.renderLoginForm) //Login Form
  .post(
    //Login Function
    redirectURL,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );
router.get("/logout", userController.logout); //Logout

module.exports = router;
