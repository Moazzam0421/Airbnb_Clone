const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

// Assuming you want to generate a URL to send to the client:
const defaultLink = '/images/defaultImage.jpg';

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: defaultLink // Default URL path for the image if none is uploaded
        },
        filename: {
            type: String,
        }
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
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
});

listSchema.post("findOneAndDelete", async (list) => {
    if(list){
        await Review.deleteMany({_id: { $in: list.reviews }});
    }
});

let List = mongoose.model("List", listSchema);

module.exports = List;