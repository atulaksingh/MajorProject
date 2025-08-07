const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc");
const methodOverride = require("method-override");
const session = require("express-session");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 *1000, // 1 day
    maxAge: 7 * 24 * 60 * 60 *1000, // 1 day
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const e = require("express");
app.use("/", listings);

const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
mongoose.connect(mongoURI).then(() => {
  console.log("MongoDB connected successfully");
});

// mongoose
//   .connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log(" MongoDB connected successfully"))
//   .catch((err) => console.error(" MongoDB connection error:", err));

app.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings", { allListings });
  })
);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
