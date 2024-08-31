const Joi = require('joi');
// const { modelName } = require('./models/reviews'); This is causes a type : circular dependency warning.

module.exports.sampleListings = Joi.object({
    list: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        img: Joi.string().allow("", null),
        price: Joi.number().required(),
        location: Joi.string().required(),  // Corrected here 
        country: Joi.string().required()
    }).required()
});



module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
})

