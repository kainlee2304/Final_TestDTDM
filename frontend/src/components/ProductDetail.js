import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError(
          error.response?.data?.error || "Không thể lấy thông tin sản phẩm!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mb-0 mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert variant="warning" className="text-center">
        Không tìm thấy sản phẩm!
      </Alert>
    );
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: "600px" }}>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Chi Tiết Sản Phẩm</h5>
      </Card.Header>
      <Card.Body>
        {product.image && (
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}
        <Card.Title className="mt-3">{product.name}</Card.Title>
        <Card.Text>
          <strong>ID:</strong> {product.id}
        </Card.Text>
        <Card.Text>
          <strong>Giá:</strong>{" "}
          {parseInt(product.price).toLocaleString("vi-VN")} ₫
        </Card.Text>
        <Card.Text>
          <strong>Ngày Tạo:</strong> {formatDate(product.created_at)}
        </Card.Text>
        <Link to="/" className="btn btn-secondary mt-3">
          Quay Lại
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductDetail;