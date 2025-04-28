import React from "react";
import { Modal, Button } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react"; // Sử dụng named export

const QRModal = ({ product, onClose }) => {
  const productUrl = `${window.location.origin}/products/${product.id}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${product.id}`);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `QR_${product.name}.png`;
    link.click();
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header className="bg-success text-white">
        <Modal.Title>Mã QR Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body className="qr-canvas">
        <QRCodeCanvas id={`qr-${product.id}`} value={productUrl} size={200} />
        <p className="text-center mt-3">Quét mã QR để xem chi tiết sản phẩm</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={downloadQR}>
          Tải Mã QR
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRModal;
