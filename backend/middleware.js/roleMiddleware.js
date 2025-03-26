const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next(); // Proceed to the next middleware or route handler
  };
};

export default roleMiddleware;
