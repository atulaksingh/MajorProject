const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc");
const multer = require("multer");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const path = require("path");
const listingController = require("../controllers/listings");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/favicon.ico", (req, res) => res.status(204).end());
// index Routes & //Create Route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    validateListing,
    isLoggedIn,
    upload.single("listing[image]"), // Handle file upload
    wrapAsync(listingController.createListing)
  );

// New Routes
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show listings  Route & update Route & Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
        upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
//

//show listings eedit Route
router.get(
  "/:id/edit",
  // validateListing,
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);




module.exports = router;
