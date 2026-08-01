// Seeds a demo admin, a demo farmer with a few products, and a demo buyer.
// Usage: npm run db:seed  (run npm run db:sync first)
require("dotenv").config();
const sequelize = require("../config/db");
const { User, Product } = require("../models/index");

async function seed() {
  try {
    await sequelize.authenticate();

    const [admin] = await User.findOrCreate({
      where: { email: "admin@agrolink.com" },
      defaults: { name: "AgroLink Admin", email: "admin@agrolink.com", password: "Admin123!", role: "admin" },
    });

    const [farmer] = await User.findOrCreate({
      where: { email: "farmer@agrolink.com" },
      defaults: {
        name: "Musa Abdullahi",
        email: "farmer@agrolink.com",
        password: "Farmer123!",
        role: "farmer",
        phone: "+234 800 000 0001",
        location: "Kano, Nigeria",
      },
    });

    await User.findOrCreate({
      where: { email: "buyer@agrolink.com" },
      defaults: {
        name: "Ada Eze",
        email: "buyer@agrolink.com",
        password: "Buyer123!",
        role: "buyer",
        phone: "+234 800 000 0002",
        location: "Lagos, Nigeria",
      },
    });

    const existingProducts = await Product.count({ where: { farmerId: farmer.id } });
    if (existingProducts === 0) {
      await Product.bulkCreate([
        {
          farmerId: farmer.id,
          name: "Fresh Tomatoes",
          description: "Freshly harvested, vine-ripened tomatoes.",
          category: "Vegetables",
          price: 1500,
          unit: "basket",
          quantity: 40,
          location: "Kano, Nigeria",
          imageUrl: "",
        },
        {
          farmerId: farmer.id,
          name: "White Maize",
          description: "Sun-dried white maize, ready for milling.",
          category: "Grains",
          price: 25000,
          unit: "bag (100kg)",
          quantity: 15,
          location: "Kano, Nigeria",
          imageUrl: "",
        },
        {
          farmerId: farmer.id,
          name: "Yam Tubers",
          description: "Large, healthy yam tubers.",
          category: "Tubers",
          price: 1200,
          unit: "tuber",
          quantity: 100,
          location: "Kano, Nigeria",
          imageUrl: "",
        },
      ]);
    }

    console.log("[db:seed] Done.");
    console.log("  Admin:  admin@agrolink.com  / Admin123!");
    console.log("  Farmer: farmer@agrolink.com / Farmer123!");
    console.log("  Buyer:  buyer@agrolink.com  / Buyer123!");
    process.exit(0);
  } catch (err) {
    console.error("[db:seed] Failed:", err);
    process.exit(1);
  }
}

seed();
