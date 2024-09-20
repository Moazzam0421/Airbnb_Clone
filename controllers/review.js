const List = require("../models/listing");
const Review = require("../models/reviews")

module.exports.reviewRoute =  async (req, res) => {
    let lists = await List.findById(req.params.id);
    let newReview = await Review(req.body.reviews)
    newReview.author = req.user._id;
    console.log(newReview)
    lists.reviews.push(newReview);
    
    await newReview.save();
    await lists.save();
    req.flash("success", "Review is Uploaded Successfully!");
    res.redirect(`/lists/${lists._id}`)
}

module.exports.reviewDestroyRoute = async (req, res) =>{
    let {id, reviewId} = req.params;
    await List.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Review was deleted Successfully!");
    res.redirect(`/lists/${id}`);
}