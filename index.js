import express from "express";
import { logger } from "./logger.js";
import routes from "./routes.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});
app.use((err, req, res, next) => {
  logger.error(
    `Received a ${req.method} request for ${req.url}\n${err.message}`
  );

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.use("/api", routes);

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
