const mongoose = require("mongoose");
const { type } = require("../schema");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
   {
      comment: String,
      rating: {
         type: Number,
         min: 1,
         max: 5,
      },
      time: {
         type: Date,
         default: Date.now(),
      },
      author: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
   }
);

module.exports = mongoose.model("Review", reviewSchema);
