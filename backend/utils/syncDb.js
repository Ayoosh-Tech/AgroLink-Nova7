// Creates (or updates) every table defined in models/ to match the current
// model definitions. Run this once after setting DATABASE_URL, and again any
// time you change a model's fields.
//
// Usage: npm run db:sync
require("dotenv").config();
const sequelize = require("../config/db");
require("../models/index");

async function sync() {
  try {
    await sequelize.authenticate();
    console.log("[db:sync] Connected to PostgreSQL.");

    // `alter: true` updates existing tables to match the models without
    // dropping data — safe to re-run during development. For a totally
    // fresh database, `force: true` would drop and recreate everything.
    await sequelize.sync({ alter: true });
    console.log(
      "[db:sync] All tables created/updated: users, products, orders, order_items."
    );
    process.exit(0);
  } catch (err) {
    console.error("[db:sync] Failed:", err);
    process.exit(1);
  }
}

sync();
