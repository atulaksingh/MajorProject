const express = require("express");
const User = require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup");
});
router.post(
  "/signup",
  wrapAsyc(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerUser = await User.register(newUser, password);
      req.flash("success", "User registered successfully!");
      console.log(registerUser);
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

router.get("/logout", (req, res,next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});




module.exports = router;
