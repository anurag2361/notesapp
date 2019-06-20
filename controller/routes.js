const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const asyncLib = require("async")

router.post("/createuser", (request, response) => {
    User.findOne({ name: request.body.name }, (err, user) => {
        if (err) {
            response.json({ "message": "An Error Occured." });
        } else if (user) {
            response.json({ "message": "User Already Exists." });
        } else {
            const newUser = new User({
                name: request.body.name
            });
            newUser.save().then((user) => {
                response.send(user);
            }).catch(err => {
                response.status(400).json({ message: "Unable to save. Error " + err });
            });
        }
    });
});

router.post("/:userid/createnote", (request, response) => {
    User.findById(request.params.userid, (err, user) => {
        if (err) {
            response.json({ message: "User doesn't exist." });
        } else {
            const newPost = new Post({
                userID: request.params.userid,
                title: request.body.title,
                postText: request.body.postText,
                postImageLink: request.body.imgLink || null,
                postVideoLink: request.body.vidLink || null
            });
            newPost.save().then(post => {
                asyncLib.series([
                    function (callback) {
                        user.postID.push({ postID: post._id, title: post.title });
                        user.save().then(doc => {
                            response.send(doc);
                        }).catch(err => {
                            console.log("Cant save postid to user.");
                        })
                        callback(null, "update done.")
                    },
                    function (callback) {
                        response.send(post);
                        callback(null, "response sent.");
                    }
                ],
                    function (err, result) {
                        console.log(result);
                    });
            }).catch(err => {
                response.status(400).json({ message: "Unable to save post. Error " + err });
            });
        }
    });
});

router.get("/:userid/allnotes", (request, response) => {
    User.findById(request.params.userid, (err, user) => {
        if (err) {
            response.json({ message: "Can't find user." });
        } else {
            response.send(user);
        }
    });
});

router.get("/:userid/:noteid/viewnote", (request, response) => {
    User.findById(request.params.userid, (err, user) => {
        if (err) {
            return response.statusCode(400).end("Can't find user.");
        } else {
            if (user.postID.length > 0) {
                for (let id = 0; id < user.postID.length; id++) {
                    if (JSON.stringify(request.params.noteid) === JSON.stringify(user.postID[id].postID)) {
                        Post.findById(request.params.noteid, (err, doc) => {
                            if (err) {
                                return response.statusCode(400).end("Can't find post.");
                            } else {
                                response.send(doc);
                            }
                        });
                    }
                }
            } else {
                response.end("No posts");
            }
        }
    });
});

router.post("/:userid/:noteid/deletenote", (request, response) => {
    User.findById(request.params.userid, (err, user) => {
        if (err) {
            return response.statusCode(400).end("Can't find user.");
        } else {
            for (let id = 0; id < user.postID.length; id++) {
                if (JSON.stringify(request.params.noteid) === JSON.stringify(user.postID[id].postID)) {
                    asyncLib.series([
                        function (callback) {
                            Post.deleteOne({ '_id': request.params.noteid }, (err) => {
                                if (err) {
                                    return response.statusCode(400).end("Can't delete post.");
                                } else {
                                    console.log("Post deleted");
                                }
                            });
                            callback(null, "delete one");
                        },
                        function (callback) {
                            User.updateOne({ "_id": user._id }, { $pull: { postID: { postID: request.params.noteid } } }, (err, data) => {
                                if (err) {
                                    return response.status(500).json({ 'error': 'error in deleting id' });
                                }
                                response.json(data);
                            });
                            callback(null, "delete two");
                        }
                    ],
                        function (err, result) {
                            console.log(result);
                        });
                }
            }
        }
    });
});

module.exports = router;