const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentsController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/:postId/comment", verifyToken, commentController.createComment);

module.exports = router;