const express = require("express");
const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/dashboard", adminController.dashboard);

router.get("/users", adminController.listUsers);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/products", adminController.listProducts);
router.delete("/products/:id", adminController.removeProduct);

router.get("/orders", adminController.listOrders);

module.exports = router;
