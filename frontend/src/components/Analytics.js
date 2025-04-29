import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/analytics/average-price-by-category`
        );
        const categories = response.data.map((item) => item.category_name);
        const prices = response.data.map((item) => item.average_price);

        setData({
          labels: categories,
          datasets: [
            {
              label: "Giá trung bình (VND)",
              data: prices,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        setError(
          error.response?.data?.error || "Không thể lấy dữ liệu phân tích!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Giá Trung Bình Theo Danh Mục",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Giá (VND)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Danh Mục",
        },
      },
    },
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

  return (
    <Card className="mb-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">Phân Tích Giá Sản Phẩm</h5>
      </Card.Header>
      <Card.Body>
        {data ? (
          <Bar data={data} options={options} />
        ) : (
          <Alert variant="warning" className="text-center">
            Không có dữ liệu để hiển thị!
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default Analytics;