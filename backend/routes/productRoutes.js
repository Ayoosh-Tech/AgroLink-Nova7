const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("category").isIn(["Vegetables", "Grains", "Fruits", "Livestock", "Tubers"]).withMessage("Invalid category."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a positive whole number."),
];

// Public browsing routes
router.get("/", productController.list);

// Farmer's own listings — must come before "/:id" so "mine" isn't parsed as an id.
router.get("/mine/list", protect, allowRoles("farmer"), productController.myProducts);

router.get("/:id", productController.getById);

// Farmer-only management routes
router.post("/", protect, allowRoles("farmer"), productValidation, validate, productController.create);
router.patch("/:id", protect, allowRoles("farmer"), productController.update);
router.delete("/:id", protect, allowRoles("farmer"), productController.remove);

module.exports = router;
