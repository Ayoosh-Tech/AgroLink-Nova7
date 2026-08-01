const { User } = require("../models/index");

// GET /api/users/me
async function getProfile(req, res) {
  res.json({ success: true, user: req.user.toSafeJSON() });
}

// PATCH /api/users/me
async function updateProfile(req, res, next) {
  try {
    const { name, phone, location } = req.body;
    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (location !== undefined) req.user.location = location;
    await req.user.save();
    res.json({ success: true, user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/me/password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const match = await req.user.comparePassword(currentPassword);
    if (!match) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }
    req.user.password = newPassword; // the beforeSave hook re-hashes this automatically
    await req.user.save();
    res.json({ success: true, message: "Password updated." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, changePassword };
