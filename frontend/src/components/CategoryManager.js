import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Spinner,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/categories");
      setCategories(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error || "Không thể lấy danh sách danh mục!"
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
      const response = await axios.post("/categories", { name: newCategory });
      alert(response.data.message);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi thêm danh mục!");
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory || !editCategory.name) return;
    try {
      const response = await axios.put(`/categories/${editCategory.id}`, {
        name: editCategory.name,
      });
      alert(response.data.message);
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi cập nhật danh mục!");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    try {
      const response = await axios.delete(`/categories/${deleteCategory.id}`);
      alert(response.data.message);
      setDeleteCategory(null);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi xóa danh mục!");
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Quản Lý Danh Mục</h5>
      </Card.Header>
      <Card.Body>
        {/* Form thêm danh mục */}
        <Form onSubmit={handleAddCategory} className="mb-4">
          <Row>
            <Col md={9}>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục mới..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button variant="primary" type="submit" className="w-100">
                Thêm Danh Mục
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Danh sách danh mục */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mb-0 mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="mb-0 text-danger">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-0 text-muted">
              Chưa có danh mục nào, thêm ngay đi!
            </p>
          </div>
        ) : (
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    {new Date(category.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-1"
                      onClick={() => setEditCategory(category)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteCategory(category)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* Modal chỉnh sửa danh mục */}
      {editCategory && (
        <Modal show onHide={() => setEditCategory(null)}>
          <Modal.Header className="bg-warning">
            <Modal.Title>Chỉnh Sửa Danh Mục</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditCategory(null)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleEditCategory}>
              Lưu Thay Đổi
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal xác nhận xóa danh mục */}
      {deleteCategory && (
        <Modal show onHide={() => setDeleteCategory(null)}>
          <Modal.Header className="bg-danger text-white">
            <Modal.Title>Xác Nhận Xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <strong>{deleteCategory.name}</strong>?
            </p>
            <p className="text-danger">Hành động này không thể hoàn tác!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteCategory(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteCategory}>
              Xóa Danh Mục
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Card>
  );
};

export default CategoryManager;
