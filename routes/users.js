const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../model/User");

router.get("/login", (req, res) => {
  // res.send("Login");
  res.render("login");
});

router.get("/register", (req, res) => {
  // res.send("Register");
  res.render("register");
});

router.post("/register", (req, res) => {
  // console.log(req.body);
  const { name, email, password, confirmpassword } = req.body;
  let errors = [];
  if (!name || !email || !password) {
    errors.push({ msg: "Please provide all details" });
  }

  if (password !== confirmpassword) {
    console.log(`${password} ${confirmpassword}`);
    errors.push({ msg: "Password and Confirm Password do not match" });
  }
  /* if (password.length < 8) {
    errors.push({ msg: "Password must be atleast 8 characters" });
  } */

  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (!strongRegex.test(password)) {
    errors.push({
      msg:
        "Password should contain atleast one lowercase, one uppercase and one special character & Min of 8 characters"
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      confirmpassword
    });
  } else {
    // res.send("Success");
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "User is already exist" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          confirmpassword
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // console.log(newUser);
        // Encrypt Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash; // store encrypted password
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "Registration Successful");
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are Successfully logout");
  res.redirect("/users/login");
});

module.exports = router;
