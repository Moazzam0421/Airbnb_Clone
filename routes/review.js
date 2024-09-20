const express = require('express');
const router = express.Router({mergeParams: true});
const List = require("../models/listing.js");
const Review = require("../models/reviews.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const {validateReviews, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/review.js')


// Review Route
router.post("/",
    isLoggedIn, 
    validateReviews, 
    wrapAsync(reviewController.reviewRoute));

// Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.reviewDestroyRoute));

module.exports = router;