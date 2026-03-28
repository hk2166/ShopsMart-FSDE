import app from "./src/app.js";
import dotenv from "dotenv";
import logger from "./src/config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`VeloStyle API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
