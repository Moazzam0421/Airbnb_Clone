const mongoose = require('mongoose');
const Review = require('./reviews');
const reviews = require('./reviews');
const Schema = mongoose.Schema;

// Assuming you want to generate a URL to send to the client:
const defaultLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUU4wbn61wXKaNC0Zzl5az6ZsXWw04gQDbjmhWRBAnyzGemEO_0g6L3YP7ojSjUnzS7ns&usqp=CAU';

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    img: {
        type: String,
        default: defaultLink,
        set: (v) => v===""? defaultLink : v,
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
});

listSchema.post("findOneAndDelete", async (list) => {
    if(list){
        await Review.deleteMany({_id: { $in: list.reviews }});
    }
});

let List = mongoose.model("List", listSchema);

module.exports = List;