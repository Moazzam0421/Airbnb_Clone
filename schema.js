const Joi = require('joi');

const sampleListings = Joi.object({
    list: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        img: Joi.string().allow("", null),
        price: Joi.number().required(),
        location: Joi.string().required(),  // Corrected here 
        country: Joi.string().required()
    }).required()
});

module.exports = sampleListings;
