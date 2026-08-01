// Small helpers so every controller returns JSON in the same shape.
// Not strictly necessary with Express, but keeps responses consistent across
// a codebase with many contributors — a Nova7 team convention.

function success(res, status, data) {
  return res.status(status).json({ success: true, ...data });
}

function failure(res, status, message, extra = {}) {
  return res.status(status).json({ success: false, message, ...extra });
}

module.exports = { success, failure };
