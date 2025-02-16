import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import passport from "../passport-config.js";
import { issueJWT } from "../jwt-config.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const sign_up_post = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required firstName"),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required lastName"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isEmail()
    .withMessage("Required email"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required password"),
  body("passwordConfirm")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Required userName"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json(errors.array());
    } else {
      bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          try {
            const user = await prisma.user.create({
              data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                author: true,
              },
            });
            res.status(200).json(user);
          } catch (err) {
            return next(err);
          }
        }
      });
    }
  }),
];

export const get_user = [
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  },
];

export function login_post(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json(info.message);
      return;
    }
    const tokenObject = issueJWT(user);
    res.status(200).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
    return;
  })(req, res, next);
}
