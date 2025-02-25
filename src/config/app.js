import express from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import logs from "../middleware/logs.js";
import authenticationRoute from "../routes/authenticationRoute.js";
import usersRoute from "../routes/usersRoute.js";
import historyRoute from "../routes/historyRoute.js";
import {
  metricsMiddleware,
  metricsEndpoint,
} from "../middleware/prometheus.js";

export function createApp() {
  dotenv.config();

  const app = express();

  app.use(metricsMiddleware);

  app.get("/metrics", metricsEndpoint);
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(logs);
  // Root Route
  app.get("/", (req, res) => {
    res.send("Hello this is Agronect Web Services ASIK");
  });

  // Authentication Routes
  app.use(authenticationRoute);
  app.use(usersRoute);
  app.use(historyRoute);

  // Error Handling untuk Route yang Tidak Ditemukan
  app.use((req, res, next) => {
    next(createError.NotFound("Tidak Ditemukan")); // Lanjutkan ke middleware error handling
  });

  // Middleware Error Handling
  app.use((err, req, res, _next) => {
    const { status = 500, message } = err;

    // Kirim respons error
    res.status(status).json({
      error: {
        status,
        message: message || "Internal Server Error",
      },
    });
  });
  return app;
}
