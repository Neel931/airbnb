const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { validateListing } = require('../middleware/validate');

const Listing = require('../models/listing');
const { isLoggedIn, isOwner } = require('../middleware');

// index
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index', { allListing });
}));

// new
router.get('/new', isLoggedIn,(req, res) => {
  
  res.render('listings/new');
});

// show
router.get('/:id', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate({path:"reviews", populate:{path:"author"}}).populate('owner');
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  // console.log(listing);.
  
  res.render('listings/show', { listing });
}));

// create
router.post('/',isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
}));

// edit
router.get('/:id/edit',isLoggedIn, isOwner,wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render('listings/edit', { listing });
}));

// update
router.put('/:id',isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {

  await Listing.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success', 'Successfully updated listing'); 
  res.redirect(`/listings/${req.params.id}`);
}));

// delete
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted listing');
  res.redirect('/listings');
}));

module.exports = router;
