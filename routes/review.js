const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const { validateReview } = require('../middleware/validate');
const {isLoggedIn}=require('../middleware')
const Listing = require('../models/listing');
const Review = require('../models/review');
const { isReviewAuthor } = require('../middleware');

// ADD REVIEW
router.post(
  '/',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
  })
);

// DELETE REVIEW
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;