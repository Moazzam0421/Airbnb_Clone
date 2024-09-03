const express = require('express');
const router = express.Router();
const List = require("../models/listing.js");
const wrapAsync = require("../Utils/wrapAsync.js")
const ExpressError = require("../Utils/ExpressError.js");
const { sampleListings } = require("../schema.js");




const defaultLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUU4wbn61wXKaNC0Zzl5az6ZsXWw04gQDbjmhWRBAnyzGemEO_0g6L3YP7ojSjUnzS7ns&usqp=CAU ';


const validateListings = (req, res, next) => {
    const { error } = sampleListings.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get("/", wrapAsync(async (req, res) => {
    // Update all documents with the same image URL
    await List.updateMany({}, { img: defaultLink });
    let allList = await List.find({});
    // console.log(allList);
    res.render("./lists/index.ejs", { allList });
}));


//New Route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("./lists/new.ejs");
}));

//Create Route
router.post("/", validateListings, wrapAsync(async (req, res, next) => {
    let newList = new List(req.body.list);
    await newList.save();
    req.flash("success", "New Post Added Successfully!");
    res.redirect("/lists");
}));


//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
        req.flash("error", "Post you searched for does not exist!");
        res.redirect("/lists");
    }
    res.render("./lists/edit.ejs", { list });
}));

//Update Route
router.put("/:id", validateListings, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndUpdate(id, { ...req.body.list });
    req.flash("success", "Post is Updated Successfully!");
    res.redirect(`./${id}`);
}));

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await List.findById(id).populate("reviews");
    if (!list) {
        req.flash("error", "Post you searched for does not exist!");
        res.redirect("/lists");
    }
    res.render("./lists/show.ejs", { list });
}));

//Delete Route
// Example delete route using wrapAsync in listing.js
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    req.flash("error", "Post was Deleted Successfully!");
    res.redirect("/lists");
}));

module.exports = router;