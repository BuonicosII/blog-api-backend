import "dotenv/config.js";
import jsonwebtoken from "jsonwebtoken";

export function issueJWT(user) {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return {
    token: signedToken,
  };
}
