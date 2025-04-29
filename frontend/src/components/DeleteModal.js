import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const DeleteModal = ({ product, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/products/${product.id}`);
      alert(response.data.message);
      onDelete();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi xóa sản phẩm!");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header className="bg-danger text-white">
        <Modal.Title>Xác Nhận Xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Bạn có chắc chắn muốn xóa sản phẩm <strong>{product.name}</strong>?
        </p>
        <p className="text-danger">Hành động này không thể hoàn tác!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Xóa Sản Phẩm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;