import "dotenv/config.js";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcpkg from "bcryptjs";
const { compare } = bcpkg;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.sub,
        },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

export default passport;
