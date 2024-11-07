module.exports.isLoggedIn = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
};
