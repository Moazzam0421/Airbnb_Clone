const mongoose = require('mongoose');
const Review = require('./reviews'); // Corrected: Using a consistent name for the required model
const Schema = mongoose.Schema;

// Assuming you want to generate a URL to send to the client:

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, // Explicitly defining the type for consistency
    },
    img: {
        type: String,
        default: defaultLink,
        set: (v) => (v === "" ? defaultLink : v), // Added spaces for better readability
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review", // Ensure that "Review" matches the name of the model
        },
    ],
});

const List = mongoose.model("List", listSchema); // Use const instead of let for consistency

module.exports = List; // Added space for better readability
