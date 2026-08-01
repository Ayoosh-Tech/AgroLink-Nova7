const { User, Product, Order, OrderItem } = require("../models/index");

// GET /api/admin/dashboard
async function dashboard(req, res, next) {
  try {
    const [totalUsers, totalFarmers, totalBuyers, totalProducts, totalOrders, pendingOrders, orders] = await Promise.all([
      User.count(),
      User.count({ where: { role: "farmer" } }),
      User.count({ where: { role: "buyer" } }),
      Product.count({ where: { status: "active" } }),
      Order.count(),
      Order.count({ where: { status: "pending" } }),
      Order.findAll({ attributes: ["totalAmount", "status"] }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    res.json({
      success: true,
      stats: { totalUsers, totalFarmers, totalBuyers, totalProducts, totalOrders, pendingOrders, totalRevenue },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users
async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "phone", "location", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id — suspend/reactivate a user, or change their role.
async function updateUser(req, res, next) {
  try {
    const { status, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();

    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    await user.destroy();
    res.json({ success: true, message: "User removed." });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/products — every listing, regardless of status.
async function listProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      include: [{ model: User, as: "farmer", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/products/:id — remove any listing (moderation).
async function removeProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    await product.destroy();
    res.json({ success: true, message: "Listing removed." });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders — every order in the system.
async function listOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "buyer", attributes: ["id", "name", "email"] },
        { model: OrderItem, as: "items" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, listUsers, updateUser, deleteUser, listProducts, removeProduct, listOrders };
