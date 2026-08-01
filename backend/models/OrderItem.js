const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "order_id",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },
    farmerId: {
      // Denormalized on purpose: lets a farmer query "order items containing
      // my products" without joining through Product every time.
      type: DataTypes.UUID,
      allowNull: false,
      field: "farmer_id",
    },
    productName: {
      // Snapshot of the product name at time of purchase, so the order
      // history still reads correctly even if the product is later edited/deleted.
      type: DataTypes.STRING,
      allowNull: false,
      field: "product_name",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    unitPrice: {
      // Snapshot of the price at time of purchase — never recalculated from
      // the live Product price, so past orders stay accurate.
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "unit_price",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
    underscored: true,
  }
);

module.exports = OrderItem;
