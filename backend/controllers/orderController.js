const sequelize = require("../config/db");
const { Order, OrderItem, Product, User } = require("../models/index");

// POST /api/orders — checkout. Buyer only.
// Body: { items: [{ productId, quantity }], deliveryAddress, deliveryPhone, notes }
// Prices are always taken from the database, never trusted from the client.
async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, deliveryAddress, deliveryPhone, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product || product.status !== "active") {
        await t.rollback();
        return res.status(400).json({ success: false, message: `A product in your cart is no longer available.` });
      }
      if (product.quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Only ${product.quantity} ${product.unit}(s) of "${product.name}" left in stock.`,
        });
      }

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        farmerId: product.farmerId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });

      product.quantity -= item.quantity;
      await product.save({ transaction: t });
    }

    const order = await Order.create(
      { buyerId: req.user.id, totalAmount, deliveryAddress, deliveryPhone, notes, status: "pending" },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      orderItemsData.map((i) => ({ ...i, orderId: order.id })),
      { transaction: t }
    );

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "items" }] });
    res.status(201).json({ success: true, order: fullOrder });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/orders/mine — the logged-in buyer's own orders.
async function myOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },
      include: [{ model: OrderItem, as: "items" }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/farmer — orders containing the logged-in farmer's products.
// Returns individual line items (each with its parent order + buyer attached),
// since a farmer should only see their own items within a multi-farmer order.
async function farmerOrders(req, res, next) {
  try {
    const items = await OrderItem.findAll({
      where: { farmerId: req.user.id },
      include: [
        { model: Order, as: "order", include: [{ model: User, as: "buyer", attributes: ["id", "name", "phone", "location"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/status — farmer (only orders containing their products) or admin.
// Body: { status: "pending" | "accepted" | "delivered" | "cancelled" }
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "accepted", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: "items" }] });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    const isAdmin = req.user.role === "admin";
    const isSellerOnOrder = order.items.some((i) => i.farmerId === req.user.id);
    if (!isAdmin && !isSellerOnOrder) {
      return res.status(403).json({ success: false, message: "You can only update orders containing your own products." });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, myOrders, farmerOrders, updateStatus };
