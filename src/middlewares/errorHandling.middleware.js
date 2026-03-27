export const catchError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
