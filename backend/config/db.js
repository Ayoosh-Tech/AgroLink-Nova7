const { Sequelize } = require("sequelize");
require("dotenv").config();

// Supabase/Neon both require SSL for external connections. `rejectUnauthorized: false`
// is standard for these managed providers since they use SSL certs that Node's
// default trust store doesn't always recognize.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("supabase") || process.env.DATABASE_URL?.includes("neon")
        ? { require: true, rejectUnauthorized: false }
        : false,
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

module.exports = sequelize;
