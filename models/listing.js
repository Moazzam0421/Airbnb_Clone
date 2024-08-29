const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming you want to generate a URL to send to the client:
const defaultLink = '/images/defaultImage.jpg';

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
    }
});

let List = mongoose.model("List", listSchema);

module.exports=List;