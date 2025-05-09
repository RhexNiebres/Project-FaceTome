const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/:postId/like", verifyToken, likeController.likePost);
router.delete("/:postId/unlike", verifyToken, likeController.unlikePost);

module.exports = router;
