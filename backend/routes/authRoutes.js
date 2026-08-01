const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("role").optional().isIn(["farmer", "buyer"]).withMessage("Role must be farmer or buyer."),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Enter a valid email."), body("password").notEmpty()],
  validate,
  authController.login
);

router.get("/me", protect, authController.me);

module.exports = router;
