import { authenticate } from "../passport-config";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const create_comment_post = [
  authenticate("jwt", { session: false }),
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

export const update_comment_put = [
  authenticate("jwt", { session: false }),
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

        await findByIdAndUpdate(comment._id, comment, {});
        res.status(200).json(comment);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const get_post_comments = asyncHandler(async (req, res, next) => {
  const allComments = await find({ post: req.params.postid })
    .populate("user")
    .sort({ timeStamp: -1 })
    .exec();
  res.status(200).json(allComments);
});

export const get_all_comments = asyncHandler(async (req, res, next) => {
  const allComments = await find()
    .populate("user")
    .sort({ timeStamp: -1 })
    .exec();
  res.status(200).json(allComments);
});
