// Restricts a route to one or more roles. Use AFTER `protect` so req.user
// already exists. Example: router.post("/", protect, allowRoles("farmer"), ...)
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `This action requires one of the following roles: ${roles.join(", ")}.`,
      });
    }
    next();
  };
}

module.exports = { allowRoles };
