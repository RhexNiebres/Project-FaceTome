const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/:postId", verifyToken, commentController.createComment);
router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;
