import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const EditModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product.image);
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", product.image);
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      onSave();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header className="bg-warning">
        <Modal.Title>Chỉnh Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá (VND)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Hình Ảnh</Form.Label>
            {preview && (
              <div className="mb-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                  }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu Thay Đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;