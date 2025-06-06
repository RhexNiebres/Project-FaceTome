const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { generateToken } = require("../middlewares/verifyToken");

console.log("the GOOGLE_CALLBACK_URL is:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email || profile.emails?.[0]?.value;
        const username = profile.displayName;
        const avatar = profile.picture;

        if (!email) return done(null, false);
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username,
              email,
              gender: "NON_SPECIFIED",
              profilePicture: avatar,
            },
          });
        } else {
          if (user.profilePicture !== avatar) {
            user = await prisma.user.update({
              where: { email },
              data: { profilePicture: avatar },
            });
          }
        }
        const token = generateToken(user);
        return done(null, { ...user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
