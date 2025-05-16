const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/:userId/followers", followController.getFollowers);
router.get("/:userId/following", followController.getFollowing);

router.post("/follow", verifyToken, followController.sendFollowRequest);
router.put(
  "/:id/accept",
  verifyToken,
  followController.acceptFollowRequest
);
router.put(
  "/:id/reject",
  verifyToken,
  followController.rejectFollowRequest
);
router.delete(
  "/:followingId",
  verifyToken,
  followController.cancelFollow
);

module.exports = router;
