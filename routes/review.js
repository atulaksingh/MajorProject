const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsyc");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      // console.log("Review data:", listing);
      if (!listing) {
        return res.status(404).send("Listing not found");
      }
      // console.log("Review data:", req.params);
      const review = new Review(req.body.review);
      listing.review.push(review);

      await review.save();
      await listing.save();
req.flash("success", " New Review successfully!");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error("Error creating review:", error);
      res
        .status(500)
        .send("Something went wrong while submitting your review.");
    }
  })
);

//review delete route
router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
req.flash("success", " Review Deleted successfully!");
  res.redirect(`/listings/${id}`);
  console.log("Listing:", listing);
});

module.exports = router;
