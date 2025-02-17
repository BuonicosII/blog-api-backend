import passport from "../passport-config.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create_comment_post = [
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
        const comment = prisma.comment.create({
          data: {
            text: req.body.text,
            timeStamp: new Date(),
            user: { connect: { id: req.user.id } },
            post: { connect: { id: req.body.postid } },
          },
        });
        res.status(200).json(comment);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const update_comment_put = [
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
        const comment = prisma.comment.update({
          where: { id: req.body.id },
          data: {
            text: req.body.text,
          },
        });
        res.status(200).json(comment);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const get_post_comments = asyncHandler(async (req, res, next) => {
  const allComments = prisma.comment.findMany({
    where: { post: { id: req.params.postid } },
    include: {
      user: true,
    },
    orderBy: { timeStamp: "desc" },
  });
  res.status(200).json(allComments);
});

export const get_all_comments = asyncHandler(async (req, res, next) => {
  const allComments = prisma.comment.findMany({
    include: {
      user: true,
    },
    orderBy: { timeStamp: "desc" },
  });
  res.status(200).json(allComments);
});
