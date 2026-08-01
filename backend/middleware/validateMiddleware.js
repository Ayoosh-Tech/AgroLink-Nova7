const { validationResult } = require("express-validator");

// Place after any express-validator `body(...)`/`query(...)` checks on a
// route. Short-circuits with a 400 if validation failed.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Please check your input and try again.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
