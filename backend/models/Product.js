const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "farmer_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: DataTypes.TEXT,
    category: {
      type: DataTypes.ENUM("Vegetables", "Grains", "Fruits", "Livestock", "Tubers"),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "kg",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    location: DataTypes.STRING,
    imageUrl: {
      type: DataTypes.STRING,
      field: "image_url",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Product;
