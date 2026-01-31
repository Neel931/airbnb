const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { validateListing } = require('../middleware/validate');

const Listing = require('../models/listing');

// index
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index', { allListing });
}));

// new
router.get('/new', (req, res) => {
  res.render('listings/new');
});

// show
router.get('/:id', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('reviews');
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  res.render('listings/show', { listing });
}));

// create
router.post('/', validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
}));

// edit
router.get('/:id/edit', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render('listings/edit', { listing });
}));

// update
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success', 'Successfully updated listing'); 
  res.redirect(`/listings/${req.params.id}`);
}));

// delete
router.delete('/:id', wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted listing');
  res.redirect('/listings');
}));

module.exports = router;
