import React, { useState, useEffect } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import QRModal from "./QRModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [qrProduct, setQrProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/products/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
      setError(
        error.response?.data?.error || "Không thể lấy danh sách sản phẩm!"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener("updateProducts", (e) => setProducts(e.detail));
    return () => {
      window.removeEventListener("updateProducts", (e) =>
        setProducts(e.detail)
      );
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Danh Sách Sản Phẩm</h5>
        <Button variant="light" size="sm" onClick={fetchProducts}>
          Làm Mới
        </Button>
      </Card.Header>
      <Card.Body className="product-list">
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mb-0 mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="mb-0 text-danger">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-0 text-muted">
              Chưa có sản phẩm nào, thêm ngay đi!
            </p>
          </div>
        ) : (
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Danh Mục</th>
                <th>Giá (VND)</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "Không có ảnh"
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category_name || "Không có danh mục"}</td>
                  <td>{parseInt(product.price).toLocaleString("vi-VN")} ₫</td>
                  <td>{formatDate(product.created_at)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-1"
                      onClick={() => setEditProduct(product)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-1"
                      onClick={() => setDeleteProduct(product)}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => setQrProduct(product)}
                    >
                      Mã QR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={fetchProducts}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onDelete={fetchProducts}
        />
      )}
      {qrProduct && (
        <QRModal product={qrProduct} onClose={() => setQrProduct(null)} />
      )}
    </Card>
  );
};

export default ProductList;
