const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/me", protect, userController.getProfile);
router.patch("/me", protect, userController.updateProfile);
router.patch(
  "/me/password",
  protect,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 8 })],
  validate,
  userController.changePassword
);

module.exports = router;
