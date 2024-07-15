const passport = require("../passport-config");
const asyncHandler = require("express-async-handler")
const Post = require('../models/post')
const { body, validationResult } = require("express-validator")

exports.create_post_post = [
  passport.authenticate("jwt", { session: false }),
  body("title").trim().isLength({ min: 1}).escape().withMessage("Required title"),
  body("text").trim().isLength({ min: 1}).escape().withMessage("Required text"),
  asyncHandler( async (req, res, next) => {
    const errors = validationResult(req)
    if (req.user.author === false) {
      res.status(403).json({
        msg: "You don't have the authorization to post"
      })
    } else if (!errors.isEmpty()) {
      res.status(200).json(errors.array())
    } else {
      try {
          const post = new Post ({
              title: req.body.title,
              text: req.body.text,
              timeStamp: new Date(),
              user: req.user._id,
              published: true
          });
          await post.save();
          res.send(post);
      } catch(err) {
          return next(err);
      };
    }
})];

exports.get_all_posts = asyncHandler ( async (req, res, next) => {
    const allPosts = await Post.find().exec();

    res.status(200).json(allPosts)
})

exports.get_post = asyncHandler ( async (req, res, next) => {
  const post = await Post.findById(req.params.postid).populate("user").exec();

  res.status(200).json(post)
})