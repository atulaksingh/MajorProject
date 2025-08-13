if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;






app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret: process.env.SECRET ,
  },
});
store.on("error", function (e) {
  console.log("Session store error", e);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 day
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
  },
};

// const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
mongoose.connect(dbUrl).then(() => {
  console.log("MongoDB connected successfully");
});



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize())
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success")|| "";
  res.locals.error = req.flash("error")|| "";
   res.locals.info = req.flash("info") || "";
  res.locals.currentUser = req.user;
  next();
});
app.get("/", (req, res) => {
  console.log("Home page accessed");
  // res.send("Welcome to Wanderlust!");
  //  res.redirect("/listings");
    req.flash("info", "listings");
  res.render("listings/home.ejs"); // home.ejs render होगा
});


const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// app.get("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
// res.render("listing/show", { listing });

// });

// app.get("/listing", async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listing/index", { allListings });
// });

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
// app.all("*", (req, res , next) => {
//  next(new ExpressError( 404,"Page Not Found"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode , message } = err;
//   res.status(statusCode).send(message)
// });
// app.use((err, req, res, next) => {
//   res.status(404).send("Please fill the form correctly");
// });
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
