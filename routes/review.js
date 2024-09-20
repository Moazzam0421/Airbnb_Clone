const express = require('express');
const router = express.Router({mergeParams: true});
const List = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const {validateReviews, isLoggedIn, isReviewAuthor} = require('../middleware.js')


// Review Route
router.post("/",
    isLoggedIn, 
    validateReviews, 
    wrapAsync( async (req, res) => {
    let lists = await List.findById(req.params.id);
    let newReview = await Review(req.body.reviews)
    newReview.author = req.user._id;
    console.log(newReview)
    lists.reviews.push(newReview);
    
    await newReview.save();
    await lists.save();
    req.flash("success", "Review is Uploaded Successfully!");
    res.redirect(`/lists/${lists._id}`)
}));

// Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync( async (req, res) =>{
    let {id, reviewId} = req.params;
    await List.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Review was deleted Successfully!");
    res.redirect(`/lists/${id}`);
}));

module.exports = router;