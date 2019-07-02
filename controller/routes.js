/* eslint-disable no-console */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const Post = mongoose.model('Post');

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

router.get("/allusers", (req, res) => {
    User.find({}, (err, user) => {
        if (err) {
            console.error(err);
        } else {
            res.send(user);
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
            newPost.save().then(async (post) => {
                await user.postID.push({ postID: post._id, title: post.title });
                await user.save().then(doc => {
                    response.send(doc);
                }).catch(err => {
                    console.log("Cant save postid to user. Err: " + err);
                });
                await response.send(post);

            }).catch(err => {
                response.end("Unable to save post. Error " + err);
            });
        }
    });
});

router.get("/:userid/allnotes", (request, response) => {
    User.findById(request.params.userid, (err, user) => {
        if (err) {
            response.json({ message: "Can't find user." });
        } else {
                response.send(user.postID);
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
    User.findById(request.params.userid, async (err, user) => {
        if (err) {
            return response.statusCode(400).end("Can't find user.");
        } else {
            for (let id = 0; id < user.postID.length; id++) {
                if (JSON.stringify(request.params.noteid) === JSON.stringify(user.postID[id].postID)) {
                    await Post.deleteOne({ '_id': request.params.noteid }, (err) => {
                        if (err) {
                            return response.end("Can't delete post.");
                        } else {
                            console.log("Post deleted");
                        }
                    });
                    await User.updateOne({ "_id": user._id }, { $pull: { postID: { postID: request.params.noteid } } }, (err, data) => {
                        if (err) {
                            return response.end('error in deleting id');
                        }
                        response.json(data);
                    });
                }
            }
        }
    });
});

router.post("/:userid/:postid/update", (request, response) => {
    User.findById(request.params.userid, (err) => {
        if (err) {
            return response.statusCode(500).end("Can't find user");
        } else {
            Post.findById(request.params.postid, async (err, postdoc) => {
                if (err) {
                    return response.statusCode(500).end("Can't find post");
                } else {
                    await postdoc.updateOne({
                        title: request.body.title,
                        postText: request.body.postText,
                        postImageLink: request.body.postImageLink,
                        postVideoLink: request.body.postVideoLink
                    }, (err) => {
                        if (err) {
                            response.end(err);
                        } else {
                            response.send({ message: "Post updated" });
                        }
                    });
                    await User.updateOne({ '_id': request.params.userid, "postID.postID": request.params.postid }, { $set: { "postID.$.title": request.body.title } }, { upsert: false }, (err) => {
                        if (err) {
                            return response.end("Title not updated in user");
                        } else {
                            console.log("title updated");
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;