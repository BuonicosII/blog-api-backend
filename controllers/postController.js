import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import passport from "../passport-config.js";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create_post_post = [
  passport.authenticate("jwt", { session: false }),
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
        const post = await prisma.post.create({
          data: {
            title: req.body.title,
            text: req.body.text,
            timeStamp: new Date(),
            user: { connect: { id: req.user.id } },
            published: req.body.published,
          },
        });
        res.status(200).json(post);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const update_post_put = [
  passport.authenticate("jwt", { session: false }),
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
        const post = await prisma.post.update({
          where: { id: req.body.id },
          data: {
            title: req.body.title,
            text: req.body.text,
            published: req.body.published,
          },
        });
        res.status(200).json(post);
      } catch (err) {
        return next(err);
      }
    }
  }),
];

export const get_all_posts = asyncHandler(async (req, res, next) => {
  const allPosts = await prisma.post.findMany({});
  res.status(200).json(allPosts);
});

export const get_post = asyncHandler(async (req, res, next) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.postid },
    include: {
      user: true,
    },
  });
  res.status(200).json(post);
});

export const delete_post = [
  passport.authenticate("jwt", { session: false }),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Enter your password")
    .custom(async (value, { req }) => {
      const match = await bcryptjs.compare(value, req.user.password);
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
          prisma.post.delete({ where: { id: req.body.id } }),
          prisma.comment.deleteMany({ where: { post: { id: req.body.id } } }),
        ]);
        res.status(200).json(req.user);
      } catch (err) {
        return next(err);
      }
    }
  }),
];
