const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentsController");
const { verifyToken } = require("../middlewares/verifyToken");

router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;
