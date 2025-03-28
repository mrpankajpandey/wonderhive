const express = require("express");

const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware/middleware.js");
const {
  signupForm,
  signup,
  loginForm,
  login,
  logout,
} = require("../controllers/userController.js");

router.route("/signup").get(signupForm).post(wrapAsync(signup));

router
  .route("/login")
  .get(loginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(login)
  );

router.get("/logout", logout);
module.exports = router;
