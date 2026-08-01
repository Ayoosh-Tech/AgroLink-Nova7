const { User } = require("../models/index");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, role, phone, location } = req.body;

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    // Only farmer/buyer can self-register — admin accounts are created manually.
    const safeRole = role === "farmer" ? "farmer" : "buyer";

    const user = await User.create({ name, email: email.toLowerCase(), password, role: safeRole, phone, location });
    const token = generateToken(user);

    res.status(201).json({ success: true, token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "This account has been suspended." });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user);
    res.json({ success: true, token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res) {
  res.json({ success: true, user: req.user.toSafeJSON() });
}

module.exports = { register, login, me };
