const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
  secret: 'thisshouldbeabettersecret',
  resace:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
     httpOnly:true,//used to security perpuse cross scripting attectus
  }
};
app.use(session(sessionOptions));
app.use(flash());

const ExpressError = require('./utils/ExpressError');

const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://127.0.0.1:27017/wendlush')
  .then(() => console.log('connected to db'))
  .catch(err => console.log(err));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});
