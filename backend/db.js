const { Pool } = require("pg");
require("dotenv").config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL không được định nghĩa trong .env!");
}

const isProduction = process.env.NODE_ENV === "production";

let pool;

try {
  if (isProduction) {
    // In production (on Render), use the DATABASE_URL environment variable
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    console.log("Using production database configuration");
  } else {
    // In development, use local connection details
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });
    console.log("Using development database configuration");
  }
} catch (err) {
  console.error("Lỗi khi khởi tạo pool:", err.stack);
  throw err;
}

pool.on("error", (err, client) => {
  console.error("Lỗi kết nối database:", err.stack);
});

// Kiểm tra kết nối ngay khi khởi tạo
pool.connect((err, client, release) => {
  if (err) {
    console.error("Không thể kết nối tới database:", err.stack);
    return;
  }
  console.log("Kết nối database thành công!");
  release();
});

module.exports = pool;
