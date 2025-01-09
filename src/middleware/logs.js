import logger from "./logger.js";

const logMiddleware = (req, res, next) => {
  const startTime = Date.now(); // Waktu mulai request

  // Bungkus `res.send` untuk menangkap body respons
  const originalSend = res.send;
  res.send = function (body) {
    res.body = body; // Simpan body ke res untuk logging
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const responseTime = Date.now() - startTime; // Hitung response time

    const logMessage = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };

    // Periksa apakah body respons adalah JSON yang valid
    let responseBody;
    try {
      responseBody =
        typeof res.body === "string" && res.body.trim().startsWith("{")
          ? JSON.parse(res.body)
          : res.body;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      responseBody = res.body; // Jika parsing gagal, gunakan body asli
    }

    const errorMessage =
      responseBody?.error?.message || responseBody?.message || "Unknown error";

    if (res.statusCode >= 400) {
      logger.error({
        message: errorMessage,
        ...logMessage,
      });
    } else {
      logger.info({
        message: responseBody?.message || "Request handled",
        ...logMessage,
      });
    }
  });

  next();
};

export default logMiddleware;
