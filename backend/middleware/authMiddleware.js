const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

// Verifies the Bearer token and attaches req.user. Use on any route that
// requires the caller to be logged in.
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "You must be logged in to do that." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user || user.status === "suspended") {
      return res.status(401).json({ success: false, message: "Account not authorized." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
  }
}

module.exports = { protect };
