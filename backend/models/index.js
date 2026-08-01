const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// A farmer (User) has many Products.
User.hasMany(Product, { foreignKey: "farmerId", as: "products" });
Product.belongsTo(User, { foreignKey: "farmerId", as: "farmer" });

// A buyer (User) has many Orders.
User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

// An Order has many OrderItems (line items).
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Each OrderItem references the Product it was purchased from.
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Each OrderItem also references the farmer who owns that product (denormalized
// for fast "orders containing my products" queries on the farmer dashboard).
User.hasMany(OrderItem, { foreignKey: "farmerId", as: "soldItems" });
OrderItem.belongsTo(User, { foreignKey: "farmerId", as: "farmer" });

module.exports = { User, Product, Order, OrderItem };
