const Listings = require("../model/listings.js");
const Review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listings.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  let result = await newReview.save();
  await listing.save();
  req.flash("success", "review added successfully...");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findById(reviewId);
  req.flash("success", "review deleted successfully...");

  res.redirect(`/listings/${id}`);
};
