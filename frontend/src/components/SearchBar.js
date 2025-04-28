import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/products?search=${searchTerm}`);
      // Cập nhật danh sách sản phẩm (có thể dùng context hoặc props)
      window.dispatchEvent(
        new CustomEvent("updateProducts", { detail: response.data })
      );
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi tìm kiếm sản phẩm!");
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">Tìm Kiếm Sản Phẩm</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={9}>
            <Form.Control
              type="text"
              placeholder="Nhập tên sản phẩm cần tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
          </Col>
          <Col md={3}>
            <Button variant="primary" className="w-100" onClick={handleSearch}>
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SearchBar;
