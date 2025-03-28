const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {
  isLoggedIn,
  isOwner,
  validateReview,
  isReviewAuthor,
} = require("../middleware/middleware.js");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController.js");

// reviews add
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));
//delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
