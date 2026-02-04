const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const { validateReview } = require('../middleware/validate');
const {isLoggedIn}=require('../middleware')
const Listing = require('../models/listing');
const Review = require('../models/review');
const { isReviewAuthor } = require('../middleware');
const reviewControllers = require('../controllers/reviews');


// ADD REVIEW
router.post(
  '/',
  isLoggedIn,
  wrapAsync(reviewControllers.creteReview)
);

// DELETE REVIEW
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;