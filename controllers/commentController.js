const passport = require("../passport-config");
const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.create_comment_post = [
  passport.authenticate("jwt", { session: false }),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required text"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      try {
        const comment = new Comment({
          text: req.body.text,
          timeStamp: new Date(),
          user: req.user._id,
          post: req.body.postid,
        });

        await comment.save();
        res.status(200).json(comment);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.update_comment_put = [
  passport.authenticate("jwt", { session: false }),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required text"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      try {
        const comment = new Comment({
          text: req.body.text,
          timeStamp: req.body.timeStamp,
          user: req.user._id,
          post: req.body.postid,
          _id: req.body._id,
        });

        await Comment.findByIdAndUpdate(comment._id, comment, {});
        res.status(200).json(comment);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.get_post_comments = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find({ post: req.params.postid })
    .populate("user")
    .sort({ timeStamp: -1 })
    .exec();
  res.status(200).json(allComments);
});

exports.get_all_comments = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find()
    .populate("user")
    .sort({ timeStamp: -1 })
    .exec();
  res.status(200).json(allComments);
});
