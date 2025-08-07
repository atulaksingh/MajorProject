const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsyc");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};
// New Routes
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
router.get("/favicon.ico", (req, res) => res.status(204).end());

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);
// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     let allListings = await Listing.find({});
//     res.render("listings", { allListings });
//   })
// );

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created successfully!");

    res.redirect("/listings");
    // } catch (err) {
    //   next(err);
    // }
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    // console.log("00", listing);
    res.render("listings/show", { listing });
  })
);
//Edit Route
router.get(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " Listing Update successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
      req.flash("success", " Listing Deleted successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
