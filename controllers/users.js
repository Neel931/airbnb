const User = require("../models/user");
const passport = require("passport");

// RENDER SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// SIGNUP LOGIC
module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const newUser = new User({ username, email });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);

    req.flash("success", "Welcome to Wendlush!");
    return res.redirect("/listings");
  });
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// LOGIN SUCCESS HANDLER
module.exports.login = (req, res) => {
  req.flash("success", "Logged in successfully!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

// LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
