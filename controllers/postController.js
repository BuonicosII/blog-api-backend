const passport = require("../passport-config");

exports.test = [passport.authenticate("jwt", { session: false }),
(req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
}]