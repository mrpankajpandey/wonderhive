const express = require("express");
const router = express.Router();
const Listings = require("../model/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");

const upload = multer({ storage });
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware.js");
const {
  index,
  renderForm,
  showListing,
  createListing,
  editForm,
  editListing,
  deleteListing,
} = require("../controllers/listingsController.js");

router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, upload.single("listing[image]" ),validateListing, wrapAsync(createListing));

router.get("/new", isLoggedIn, wrapAsync(renderForm));
// its mandate to before listings/:id , becasue new treated as id
// new form route
// show specific id post route
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]" ), validateListing, wrapAsync(editListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));
//edit route, show form

// edit route

//delete route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editForm));
module.exports = router;
