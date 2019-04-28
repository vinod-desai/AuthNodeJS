const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  // res.send("Welcome to Auth App");
  res.render("home");
});

router.get("/dashboard", checkAuthenticated, (req, res) => {
  // res.send("User Dashboard");
  res.render("dashboard", {
    user: req.user
  });
});

module.exports = router;
