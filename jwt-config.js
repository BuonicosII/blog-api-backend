require('dotenv').config()
const jsonwebtoken = require("jsonwebtoken");

exports.issueJWT = (user) => {
    const payload = {
        sub: user._id,
        iat: Date.now()
    }

    const signedToken = jsonwebtoken.sign(payload, process.env.PRIV_KEY, {
        expiresIn: "1d"
    });

    return {
        token: "Bearer " + signedToken,
    };
}