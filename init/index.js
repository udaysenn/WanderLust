const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "68360c9fd40c7ce619344a58"}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();