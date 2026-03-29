export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Supabase errors
  if (err.code) {
    return res.status(400).json({
      error: "Database error",
      message: err.message,
      code: err.code,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};
