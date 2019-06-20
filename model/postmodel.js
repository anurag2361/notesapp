const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let postSchema = new Schema({
    userID: { type: String, required: true },
    title: { type: String },
    postText: { type: String },
    postImageLink: { type: String },
    postVideoLink: { type: String }
});
mongoose.model('Post', postSchema);