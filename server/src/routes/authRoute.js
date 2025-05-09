const express = require("express");
const passport = require("passport");    
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign-up", authController.postSignUp);
router.post("/log-in", authController.postLogin);

router.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  
  router.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/" }),
    (req, res) => {
      const { token, id, username, email, profilePicture } = req.user;
      res.redirect(
        `${process.env.CLIENT_HOST}/oauth-success?` +
        `token=${token}&userId=${id}` +
        `&username=${username}` +
        `&email=${email}` +
        `&avatar=${encodeURIComponent(profilePicture)}`
      );
    }
  );
module.exports = router;
