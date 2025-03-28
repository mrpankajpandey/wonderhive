const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{ timestamps: true })

module.exports = mongoose.model("Review",reviewSchema);