const express=require("express");
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require('./schema.js')
const Review=require('./models/review.js')

const Listing=require('./models/listing.js');
const { log } = require("console");
const MONGO_URL='mongodb://127.0.0.1:27017/wendlush';

main().then(function(){console.log("connecteed to db");
})
.catch(function(err){return console.log(err);});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.send("hi, i am root")
})

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// index route:
app.get("/listings", wrapAsync(async function(req, res) {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
}));

// new route:

app.get("/listings/new", function(req, res) {
  res.render("listings/new.ejs");
});

// show route route:
app.get("/listings/:id", wrapAsync(async function(req, res) {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render("listings/show.ejs", { listing });
}));

// creating Rutes:
app.post("/listings",
  validateListing, 
  wrapAsync(async function(req, res, next) {
    const newListing = new Listing(req.body); 
  await newListing.save();
  res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async function(req, res) {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// update rouet:
app.put("/listings/:id",validateListing, wrapAsync(async function(req, res) {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body);
  res.redirect(`/listings/${id}`);
}));

// delete route:
app.delete("/listings/:id", wrapAsync(async function(req, res) {
  console.log("DELETE HIT", req.params.id);
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
}));

// review post:
app.post('/listings/:id/reviews',validateReview, wrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newReview=new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))


// delete review routes:
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
 
  await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });
  
  await Review.findByIdAndDelete(reviewId);
  
   res.redirect(`/listings/${id}`);
}))


// app.get('/tesListing',async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"bt the beach",
//         price:1200,
//         location:"calangute",
//         country:"india"
//     })
//     await sampleListing.save();;
//     console.log("sample was saved");
//     res.send("suceesfull testing")
// })

// 404 handler (ALWAYS after all routes)
 

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;

  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080,function(){
    console.log(`server is listing port 8080`);
})
