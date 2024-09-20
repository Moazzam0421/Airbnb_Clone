const ExpressError = require("./Utils/ExpressError.js");
const List = require("./models/listing.js");
const Review = require("./models/reviews.js");
const { sampleListings, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be login to access some Grants!");
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let list = await List.findById(id);
    if (!list.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Sorry, you do not have permission to make changes!");
        return res.redirect(`/lists/${list._id}`);  // Return after redirect
    }
    next(); // Only call next if the user is the owner
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Sorry, you do not have permission to make changes!");
        return res.redirect(`/lists/${id}`);  // Return after redirect
    }
    next(); // Only call next if the user is the review author
}



// Validate listings middleware
module.exports.validateListings = (req, res, next) => {
    const { error } = sampleListings.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// Validate Review middleware
module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};