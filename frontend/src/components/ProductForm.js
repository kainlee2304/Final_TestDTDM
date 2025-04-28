import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      setName("");
      setPrice("");
      setImage(null);
      setCategoryId("");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Thêm Sản Phẩm Mới</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Sản Phẩm</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Giá (VND)</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Danh Mục</Form.Label>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Hình Ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button type="submit" variant="success" className="w-100">
                Thêm Sản Phẩm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;
