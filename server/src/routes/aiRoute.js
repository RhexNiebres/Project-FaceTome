const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post('/posts', verifyToken, aiController.generatePost);

module.exports = router;