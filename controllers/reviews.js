const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log("Review data:", listing);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    // console.log("Review data:", req.params);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // console.log("Review data:", review);
    listing.review.push(review);

    await review.save();
    await listing.save();
    req.flash("success", " New Review successfully!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).send("Something went wrong while submitting your review.");
  }
};


module.exports.deleteReview =   async (req, res) => {
    const { id, reviewId } = req.params;
    // const listing = await Listing.findByIdAndUpdate(id, {
    //   $pull: { review: reviewId },
    // });
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
    // console.log("Listing:", listing);
  }