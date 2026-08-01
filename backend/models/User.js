const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");

class User extends Model {
  // Compares a plaintext password against this user's stored hash.
  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  // Strips the password hash before sending a user object back to the client.
  toSafeJSON() {
    const { id, name, email, role, phone, location, status, createdAt } = this;
    return { id, name, email, role, phone, location, status, createdAt };
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
         validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("farmer", "buyer", "admin"),
      allowNull: false,
      defaultValue: "buyer",
    },
    phone: DataTypes.STRING,
    location: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("active", "suspended"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      // Hash the password automatically any time it's set or changed —
      // controllers never need to remember to do this themselves.
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

module.exports = User;
