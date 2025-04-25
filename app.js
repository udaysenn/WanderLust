const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err)
});

function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err)=>next(err));
    };
}

//Home Route
app.get("/" , (req, res) => {
    res.send("root");
});

//Index Route
app.get("/listings", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", asyncWrap(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Show Route
app.get("/listings/:id", asyncWrap(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
}));

//Edit Route
app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", asyncWrap(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
app.delete("/listings/:id", asyncWrap(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.use((err, req, res, next) => {
    let{ status=500, message} = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

