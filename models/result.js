import mongoose from "mongoose";

//result Schema
const Result = mongoose.Schema({
    Roll_No :{
        type: Number,
        require: true,
        unique: true
    },
    Name :{
        type: String,
        require: true
    },
    DOB :{
        type: String,
        require: true
    },
    Score :{
        type: Number,
        require: true
    }

});

//model
const resultModel = mongoose.model("result",Result)

export default resultModel