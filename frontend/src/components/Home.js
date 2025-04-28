import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="mb-4">Chào Mừng Đến Với Ứng Dụng Quản Lý Sản Phẩm</h1>
      <p className="lead mb-5">
        Quản lý sản phẩm dễ dàng, hiệu quả và trực quan. Tạo, chỉnh sửa, phân
        loại sản phẩm và phân tích giá cả chỉ với vài cú nhấp chuột!
      </p>

      <Row className="justify-content-center">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Danh Sách Sản Phẩm</Card.Title>
              <Card.Text>
                Xem, thêm, chỉnh sửa và quản lý danh sách sản phẩm của bạn.
              </Card.Text>
              <Button as={Link} to="/products" variant="primary">
                Xem Sản Phẩm
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Quản Lý Danh Mục</Card.Title>
              <Card.Text>
                Tạo, chỉnh sửa và xóa các danh mục để phân loại sản phẩm.
              </Card.Text>
              <Button as={Link} to="/categories" variant="success">
                Quản Lý Danh Mục
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Phân Tích Giá</Card.Title>
              <Card.Text>
                Xem biểu đồ giá trung bình theo danh mục và xu hướng giá theo
                thời gian.
              </Card.Text>
              <Button as={Link} to="/analytics" variant="info">
                Xem Phân Tích
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
