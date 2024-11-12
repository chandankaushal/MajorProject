const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.createUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);

    req.login(newUser, (err) => {
      if (err) {
        console.log("There was an error logging in the new User after signup");
        return next(err);
      }
      req.flash("success", "You have signed up! Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
  //req.flash("success", "Welcome to Wanderlust!");
  req.flash("success", "Welcome to Wanderlust! You are Logged in");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You have been Logged out!");
    res.redirect("/listings");
  });
};
