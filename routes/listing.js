const express = require('express');
const router = express.Router();
const List = require("../models/listing.js");
const wrapAsync = require("../Utils/wrapAsync.js")
const ExpressError = require("../Utils/ExpressError.js");
const { sampleListings } = require("../schema.js");
const multer = require("multer");
const path = require("path")

const { isLoggedIn } = require("../middleware.js")


const defaultLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUU4wbn61wXKaNC0Zzl5az6ZsXWw04gQDbjmhWRBAnyzGemEO_0g6L3YP7ojSjUnzS7ns&usqp=CAU ';

router.use(express.static(path.join(__dirname, "/uploads")))

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Validate listings middleware
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
    // await List.updateMany({}, { img: defaultLink });
    let allList = await List.find({});
    // console.log(allList);
    res.render("./lists/index.ejs", { allList });
}));


//New Route
router.get("/new", isLoggedIn, wrapAsync(async (req, res, next) => {
    console.log(req.user)
    res.render("./lists/new.ejs");
}));

//Create Route
// router.post("/", isLoggedIn, validateListings, wrapAsync(async (req, res, next) => {
//     let newList = new List(req.body.list);
//     // console.log(newList)
//     await newList.save();
//     req.flash("success", "New Post Added Successfully!");
//     res.redirect("/lists");
// }));

// Create Route with Image Upload
router.post("/",isLoggedIn, upload.single('image'), validateListings, wrapAsync(async (req, res, next) => {
    const newList = new List(req.body.list);
    
    // Check if an image was uploaded and set the image path
    if (req.file) {
        newList.img = `/uploads/${req.file.filename}`;
    } else {
        newList.img = defaultLink; // Set default image if no image is uploaded
    }

    await newList.save();
    req.flash("success", "New Post Added Successfully!");
    res.redirect("/lists");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
        req.flash("error", "Post you searched for does not exist!");
        res.redirect("/lists");
    }
    res.render("./lists/edit.ejs", { list });
}));

//Update Route
// router.put("/:id", isLoggedIn, validateListings, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await List.findByIdAndUpdate(id, { ...req.body.list });
//     req.flash("success", "Post is Updated Successfully!");
//     res.redirect(`./${id}`);
// }));

// Update Route with Image Upload
router.put("/:id",isLoggedIn, upload.single('image'), validateListings, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.list;

    // Check if a new image is uploaded
    if (req.file) {
        updatedData.img = `/uploads/${req.file.filename}`;
    }

    await List.findByIdAndUpdate(id, updatedData);

    req.flash("success", "Post is Updated Successfully!");
    res.redirect(`./${id}`);
}));

//Show Route
router.get("/:id",wrapAsync(async (req, res) => {
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
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    req.flash("error", "Post was Deleted Successfully!");
    res.redirect("/lists");
}));

module.exports = router;