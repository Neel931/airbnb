const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");

// SIGNUP (GET + POST)
router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signup));

// LOGIN (GET + POST)
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersController.login
  );

// LOGOUT
router.get("/logout", usersController.logout);

module.exports = router;
