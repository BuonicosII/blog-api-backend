const passport = require("../passport-config");
const asyncHandler = require("express-async-handler")
const Comment = require('../models/comment')
const { body, validationResult } = require("express-validator")

exports.create_comment_post = [
    passport.authenticate("jwt", { session: false }),
    body("text").trim().isLength({ min: 1}).escape().withMessage("Required text"),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json(errors.array())
        } else {
            try {
                const comment = new Comment({
                    text: req.body.text,
                    timeStamp: new Date(),
                    user: req.user._id,
                    post: req.body.postid
                })

                await comment.save();
                res.send(comment);
            } catch(err) {
                return next(err);
            };
        }
    })
]