const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
dotenv = require('dotenv');
dotenv.config();

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const dbUrl=process.env.ATLASDB_URL;


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.secret
  },
  touchAfter:24*60*60
}); 
 
store.on("error",function(e){
  console.log("SESSION STORE ERROR",e)
});

const sessionOptions = {
  store,
  secret: 'thisshouldbeabettersecret',
  resave: false,
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
const userRoutes = require('./routes/user');



main().then(() => {
  console.log('Database connected');
}).catch(err => {

  console.log('Database connection error:');
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
  console.log('MongoDB connected');
} 

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// app.get('/demouser', async (req, res) => {
//   const fakeUser = new User({
//      email: 'demo@example.com',
//      username: 'demouser'
//     });
//   let registeredUser = await User.register(fakeUser, 'demopassword');
//   res.send(registeredUser);
// });

app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
// 404 page not found handler
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// error handler

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render('error', { err });
});       

app.listen(8080, () => {
  console.log('server listening on port 8080');
});
