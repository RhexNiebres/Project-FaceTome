const express = require("express");
const router = express.Router();
const postController = require("../controllers/postsController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, postController.getAllPosts);
router.post("/", verifyToken, postController.createPost);
router.delete("/:id", verifyToken, postController.deletePost);

module.exports = router;
