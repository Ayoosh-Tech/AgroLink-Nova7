const { Op } = require("sequelize");
const { Product, User } = require("../models/index");

// GET /api/products?search=&category=&minPrice=&maxPrice=&location=&page=&limit=
// Public — powers the Products browse/search page.
async function list(req, res, next) {
  try {
    const { search, category, minPrice, maxPrice, location, page = 1, limit = 12 } = req.query;

    const where = { status: "active" };
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category) where.category = category;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: User, as: "farmer", attributes: ["id", "name", "location", "phone"] }],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({ success: true, products: rows, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id — public product details page.
async function getById(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: User, as: "farmer", attributes: ["id", "name", "location", "phone"] }],
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/mine/list — the logged-in farmer's own listings (for the Farmer Dashboard).
async function myProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      where: { farmerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

// POST /api/products — farmer only.
async function create(req, res, next) {
  try {
    const { name, description, category, price, unit, quantity, location, imageUrl } = req.body;
    const product = await Product.create({
      farmerId: req.user.id,
      name,
      description,
      category,
      price,
      unit,
      quantity,
      location: location || req.user.location,
      imageUrl,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/products/:id — farmer only, and only their own product.
async function update(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (product.farmerId !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own listings." });
    }

    const fields = ["name", "description", "category", "price", "unit", "quantity", "location", "imageUrl", "status"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id — farmer only, and only their own product.
async function remove(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (product.farmerId !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own listings." });
    }
    await product.destroy();
    res.json({ success: true, message: "Listing deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, myProducts, create, update, remove };
