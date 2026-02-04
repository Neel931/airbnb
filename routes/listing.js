const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { validateListing } = require('../middleware/validate');

const Listing = require('../models/listing');
const { isLoggedIn, isOwner } = require('../middleware');
const listingsController = require('../controllers/listings');
router
  .route('/')
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingsController.createListing)
  );

// NEW FORM
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// SHOW + UPDATE + DELETE
router
  .route('/:id')
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.deleteListing)
  );

// EDIT FORM
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);


module.exports = router;
