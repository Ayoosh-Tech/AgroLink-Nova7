const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("buyer"),
  [
    body("items").isArray({ min: 1 }).withMessage("Your cart is empty."),
    body("deliveryAddress").trim().notEmpty().withMessage("A delivery address is required."),
  ],
  validate,
  orderController.create
);

router.get("/mine", protect, allowRoles("buyer"), orderController.myOrders);
router.get("/farmer", protect, allowRoles("farmer"), orderController.farmerOrders);
router.patch("/:id/status", protect, allowRoles("farmer", "admin"), orderController.updateStatus);

module.exports = router;
