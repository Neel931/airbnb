const Listing = require('../models/listing');

module.exports = {
  // INDEX
  index: async (req, res) => {
    const allListing = await Listing.find({});
    res.render('listings/index', { allListing });
  },

  // SHOW
  showListing: async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'author' }
      })
      .populate('owner');

    if (!listing) {
      req.flash('error', 'Cannot find that listing!');
      return res.redirect('/listings');
    }

    res.render('listings/show', { listing });
  },

  // 👉 NEW LISTING FORM (THIS WAS MISSING)
  renderNewForm: (req, res) => {
    res.render('listings/new');
  },

  // CREATE
  createListing: async (req, res) => {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
  },

  // EDIT FORM
  renderEditForm: async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash('error', 'Cannot find that listing!');
      return res.redirect('/listings');
    }

    res.render('listings/edit', { listing });
  },

  // UPDATE
  updateListing: async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${req.params.id}`);
  },

  // DELETE
  deleteListing: async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted listing');
    res.redirect('/listings');
  }
};
