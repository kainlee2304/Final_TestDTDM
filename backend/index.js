const express = require("express");
const pool = require("./db");
const path = require("path");
const multer = require("multer");
const app = express();

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ file ảnh JPEG/JPG/PNG!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Tạo bảng categories nếu chưa có
pool
  .query(
    `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  )
  .then(() => console.log("Bảng categories sẵn sàng!"));

// Tạo bảng products nếu chưa có
pool
  .query(
    `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price INT NOT NULL,
      image VARCHAR(255),
      category_id INT REFERENCES categories(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  )
  .then(() => console.log("Bảng products sẵn sàng!"));

// Middleware validate dữ liệu
const validateProduct = (req, res, next) => {
  const { name, price, category_id } = req.body;
  if (!name || !price || isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ error: "Tên và giá hợp lệ là bắt buộc, giá phải là số dương!" });
  }
  if (category_id && isNaN(category_id)) {
    return res.status(400).json({ error: "Danh mục không hợp lệ!" });
  }
  next();
};

// Middleware validate danh mục
const validateCategory = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Tên danh mục là bắt buộc!" });
  }
  next();
};

// Route hiển thị giao diện React
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Route lấy danh sách danh mục
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy danh sách danh mục:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route thêm danh mục
app.post("/categories", validateCategory, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res
      .status(201)
      .json({ message: "Thêm danh mục thành công!", category: result.rows[0] });
  } catch (err) {
    console.error("Lỗi thêm danh mục:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route sửa danh mục
app.put("/categories/:id", validateCategory, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Danh mục không tồn tại!" });
    }
    res.json({
      message: "Cập nhật danh mục thành công!",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Lỗi cập nhật danh mục:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route xóa danh mục
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE products SET category_id = NULL WHERE category_id = $1",
      [id]
    );
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Danh mục không tồn tại!" });
    }
    res.json({ message: "Xóa danh mục thành công!", category: result.rows[0] });
  } catch (err) {
    console.error("Lỗi xóa danh mục:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route lấy giá trung bình theo danh mục
app.get("/analytics/average-price-by-category", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT c.id, c.name AS category_name, COALESCE(AVG(p.price), 0) AS average_price
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY c.name
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy giá trung bình theo danh mục:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route lấy tất cả sản phẩm
app.get("/products/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy danh sách sản phẩm:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route hiển thị chi tiết sản phẩm
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID sản phẩm phải là số!" });
  }
  try {
    const result = await pool.query(
      "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi lấy chi tiết sản phẩm:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Route thêm sản phẩm
app.post(
  "/products",
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    const { name, price, category_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      const result = await pool.query(
        "INSERT INTO products (name, price, image, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, price, image, category_id || null]
      );
      res
        .status(201)
        .json({
          message: "Thêm sản phẩm thành công!",
          product: result.rows[0],
        });
    } catch (err) {
      console.error("Lỗi thêm sản phẩm:", err.stack);
      res.status(500).json({ error: "Lỗi server, thử lại nha!" });
    }
  }
);

// Route tìm kiếm sản phẩm (hỗ trợ lọc theo danh mục)
app.get("/products", async (req, res) => {
  const { search, category_id } = req.query;
  let query =
    "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1";
  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND p.name ILIKE $${paramIndex}`;
    values.push(`%${search}%`);
    paramIndex++;
  }
  if (category_id) {
    query += ` AND p.category_id = $${paramIndex}`;
    values.push(category_id);
    paramIndex++;
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err.stack);
    res.status(500).json({ error: "Không tìm thấy gì, sorry nha!" });
  }
});

// Route cập nhật sản phẩm
app.put(
  "/products/:id",
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    const { id } = req.params;
    const { name, price, category_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    try {
      const result = await pool.query(
        "UPDATE products SET name = $1, price = $2, image = $3, category_id = $4 WHERE id = $5 RETURNING *",
        [name, price, image, category_id || null, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
      }
      res.json({
        message: "Cập nhật sản phẩm thành công!",
        product: result.rows[0],
      });
    } catch (err) {
      console.error("Lỗi cập nhật:", err.stack);
      res.status(500).json({ error: "Lỗi server, thử lại nha!" });
    }
  }
);

// Route xóa sản phẩm
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
    }
    res.json({ message: "Xóa sản phẩm thành công!", product: result.rows[0] });
  } catch (err) {
    console.error("Lỗi xóa:", err.stack);
    res.status(500).json({ error: "Lỗi server, thử lại nha!" });
  }
});

// Khởi động server
console.log("Server đang khởi động...");
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server chạy ngon lành trên port ${PORT}!`);
});
