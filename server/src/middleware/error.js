export function notFound(req, res) {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === 11000)
    return res.status(409).json({ message: "A unique field already exists" });
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}
