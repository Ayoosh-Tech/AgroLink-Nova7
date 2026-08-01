const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "buyer_id",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "delivery_address",
    },
    deliveryPhone: {
      type: DataTypes.STRING,
      field: "delivery_phone",
    },
    notes: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Order;
