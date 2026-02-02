const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;  
const Review=require('./review.js')

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews:[
   {
     type:Schema.Types.ObjectId,
     ref:"Review",
   }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});


// if listing delete review should be delete
listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

module.exports = mongoose.model("Listing", listingSchema);
