const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const startTime = Date.now();
let requestCount = 0;
let visitors = new Set();

// middleware hitung request & visitor
app.use((req, res, next) => {
  requestCount++;

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  visitors.add(ip);
  next();
});

// serve file statis (HTML & CSS)
app.use(express.static(path.join(__dirname, "public")));

function getUptime() {
  const diff = Date.now() - startTime;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

// endpoint data (biar HTML ambil data)
app.get("/data", (req, res) => {
  res.json({
    status: "ONLINE",
    uptime: getUptime(),
    requests: requestCount,
    visitors: visitors.size,
    node: process.version,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
