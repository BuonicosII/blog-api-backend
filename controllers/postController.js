const passport = require("../passport-config");
const asyncHandler = require("express-async-handler")
const Post = require('../models/post')

exports.create_post_post = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler( async (req, res, next) => {

    if (req.user.author === false) {
      res.status(403).json({
        msg: "You don't have the authorization to post"
      })
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


})]