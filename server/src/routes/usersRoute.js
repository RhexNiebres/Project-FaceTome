const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, usersController.getAllUsers);
router.get("/:id", verifyToken, usersController.getUserById);
router.put("/:id", verifyToken, usersController.updateUser);

module.exports = router;
