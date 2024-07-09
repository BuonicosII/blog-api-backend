const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")
const User = require('../models/user')
const bcrypt = require("bcryptjs")
const passport = require("../passport-config");
const jwt = require('../jwt-config')


exports.sign_up_post = [
    body("firstName").trim().isLength({ min: 1}).escape().withMessage("Required firstName"),
    body("lastName").trim().isLength({ min: 1}).escape().withMessage("Required lastName"),
    body("email").trim().isLength({ min: 1}).escape().isEmail().withMessage("Required email"),
    body("password").trim().isLength({ min: 1}).escape().withMessage("Required password"),
    body("passwordConfirm").custom( (value, { req }) => { return value === req.body.password }).withMessage("Passwords don't match"), 
    body("username").trim().isLength({ min: 1}).escape().withMessage("Required userName"),
    
    asyncHandler (async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.send(errors.array())
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    return next(err)
                } else {
                    try {
                        const user = new User({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            username: req.body.username,
                            password: hashedPassword,
                            author: true
                        });
                        await user.save();
                        res.send(user);
                    } catch(err) {
                        return next(err);
                    };
                } 
            })
        }
    })
];

exports.login_post = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            res.send(info.message)
            return;
        }
        const tokenObject = jwt.issueJWT(user)
        res.status(200).json({
            success: true,
            token: tokenObject.token,
            expiresIn: tokenObject.expires,
          });
        return;
    })(req, res, next)
}