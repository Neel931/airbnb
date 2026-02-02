const mongoose=require("mongoose");
const initData=require('./data.js');
const Listing=require('../models/listing.js')

const MONGO_URL='mongodb://127.0.0.1:27017/wendlush';

main().then(()=>{console.log("connecteed to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "69803647a78ed908ec452b4d",
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized with owner");
};

initDB();
