const express = require('express');
const router = express.Router({mergeParams: true});
const List = require("../models/listing.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../Utils/ExpressError.js");

const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../Utils/wrapAsync.js");

const validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Review Route
router.post("/", validateReviews, wrapAsync( async (req, res) => {
    let lists = await List.findById(req.params.id);
    let newReview = await Review(req.body.reviews)
    lists.reviews.push(newReview);

    await newReview.save();
    await lists.save();
    res.redirect(`/lists/${lists._id}`)
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync( async (req, res) =>{
    let {id, reviewId} = req.params;
    await List.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/lists/${id}`);
}));

module.exports = router;