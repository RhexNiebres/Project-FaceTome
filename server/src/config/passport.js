const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { generateToken } = require("../middlewares/verifyToken");


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.APP_PORT}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const username = profile.username;
        const avatar   = profile.photos?.[0]?.value;  

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
