import { Counter, Histogram, Gauge, register } from "prom-client";

// Counter untuk menghitung jumlah kesalahan API (4xx dan 5xx)
export const errorCounter = new Counter({
  name: "api_errors_total",
  help: "Jumlah kesalahan API (4xx dan 5xx)",
  labelNames: ["method", "endpoint", "status_code"],
});

// Counter untuk menghitung jumlah request per endpoint
export const requestCounter = new Counter({
  name: "api_requests_total",
  help: "Total jumlah request API",
  labelNames: ["method", "endpoint"],
});

// Histogram untuk mengukur waktu respons API per endpoint
export const responseTimeHistogram = new Histogram({
  name: "api_response_duration_seconds",
  help: "Durasi waktu respons API dalam detik",
  labelNames: ["method", "endpoint"],
  buckets: [0.1, 0.5, 1, 2, 5], // Bucket waktu untuk histogram
});

// Gauge untuk menghitung jumlah request per detik
export const requestPerSecondGauge = new Gauge({
  name: "api_requests_per_second",
  help: "Jumlah request API per detik",
});

// Interval untuk menghitung request per second
// Interval untuk menghitung request per second
setInterval(() => {
  const metricData = requestCounter.get();
  const totalRequests = metricData.values
    ? metricData.values.reduce((acc, val) => acc + val.value, 0)
    : 0; // Default ke 0 jika values undefined
  requestPerSecondGauge.set(totalRequests);
}, 1000);

register.registerMetric(errorCounter);
register.registerMetric(requestCounter);
register.registerMetric(responseTimeHistogram);
register.registerMetric(requestPerSecondGauge);

export const metricsMiddleware = (req, res, next) => {
  const end = responseTimeHistogram.labels(req.method, req.path).startTimer();

  requestCounter.labels(req.method, req.path).inc(); // Menghitung jumlah request per endpoint

  res.on("finish", () => {
    // Menghitung error count berdasarkan status kode
    const statusCode = res.statusCode;
    if (statusCode >= 400 && statusCode < 600) {
      errorCounter.labels(req.method, req.path, statusCode.toString()).inc();
    }
    end(); // Menyelesaikan pengukuran waktu respons
  });

  next();
};

// Middleware untuk monitoring log level (jika logging digunakan)
export const logLevelMiddleware = (level) => {
  const logCounter = new Counter({
    name: `api_logs_${level}_total`,
    help: `Jumlah log dengan level ${level}`,
  });
  register.registerMetric(logCounter);

  return (req, res, next) => {
    req.log = (message) => {
      console[level](message); // Contoh log output
      logCounter.inc(); // Increment counter untuk level log ini
    };
    next();
  };
};

// Expose metrik Prometheus pada endpoint '/metrics'
export const metricsEndpoint = async (req, res) => {
  try {
    const metrics = await register.metrics(); // Ambil semua metrik yang terdaftar
    res.set("Content-Type", register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).send("Error fetching metrics");
  }
};
