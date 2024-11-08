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
