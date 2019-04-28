const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

require("./config/passport")(passport);

// Get DB configuration
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

//Embedded JavaScript EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body Parser Middleware (Included in Express)
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize()); // init local strategy
app.use(passport.session());

// Middleware for flash
app.use(flash());

// Global Variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));

app.listen(PORT, () =>
  console.log(`Express web server is running on port ${PORT}`)
);
