const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: true },
    postID: [{ postID: Schema.Types.ObjectId, title: String }]
});

mongoose.model('User', userSchema);