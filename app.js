const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const mongoURI = "mongodb://127.0.0.1:27017/wanderlust";
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));

app.get("/",wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New Routes
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post("/listings",wrapAsync( async (req, res) => {
  // try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
  // } catch (err) {
  //   next(err);
  // }
}));

app.get("/listings/:id",wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));
//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/");
}));

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
  console.log("Server is running on port 8000");
});
