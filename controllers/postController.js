import { authenticate } from "../passport-config.js";
import asyncHandler from "express-async-handler";
import { compare } from "bcryptjs";
import { body, validationResult } from "express-validator";

export const create_post_post = [
  authenticate("jwt", { session: false }),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required title"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required text"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (req.user.author === false) {
      res.status(403).json({
        msg: "You don't have the authorization to post",
      });
    } else if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      try {
        const post = new Post({
          title: req.body.title,
          text: req.body.text,
          timeStamp: new Date(),
          user: req.user._id,
          published: req.body.published,
        });
        await post.save();
        res.status(200).json(post);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const update_post_put = [
  authenticate("jwt", { session: false }),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required title"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required text"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (req.user.author === false) {
      res.status(403).json({
        msg: "You don't have the authorization to post",
      });
    } else if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      try {
        const post = new Post({
          title: req.body.title,
          text: req.body.text,
          timeStamp: new Date(),
          user: req.user._id,
          published: req.body.published,
          _id: req.body._id,
        });
        await findByIdAndUpdate(req.body._id, post, {});
        res.status(200).json(post);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const get_all_posts = asyncHandler(async (req, res, next) => {
  const allPosts = await find().exec();

  res.status(200).json(allPosts);
});

export const get_post = asyncHandler(async (req, res, next) => {
  const post = await findById(req.params.postid).populate("user").exec();

  res.status(200).json(post);
});

export const delete_post = [
  authenticate("jwt", { session: false }),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Enter your password")
    .custom(async (value, { req }) => {
      const match = await compare(value, req.user.password);
      return match;
    })
    .withMessage("Wrong password"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      try {
        await Promise.all([
          findByIdAndDelete(req.body._id),
          deleteMany({ post: req.body._id }),
        ]);

        res.status(200).json(req.user);
      } catch (err) {
        return next(err);
      }
    }
  }),
];
