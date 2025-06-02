const express = require("express");
const router = express.Router();
const postController = require("../controllers/postsController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentsController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, postController.getAllPosts);
router.post("/", verifyToken, postController.createPost);
router.delete("/:id", verifyToken, postController.deletePost);
router.post("/:postId/like", verifyToken, likeController.toggleLikePost);
module.exports = router;
