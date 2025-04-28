import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import ProductDetail from "./components/ProductDetail";
import CategoryManager from "./components/CategoryManager";
import Analytics from "./components/Analytics";
import { Container, Navbar, Nav } from "react-bootstrap";
import { FaHome, FaList, FaFolder, FaChartBar, FaStore } from "react-icons/fa"; // Import biểu tượng
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="mb-4 custom-navbar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FaStore className="me-2" /> Quản Lý Sản Phẩm
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                <FaHome className="me-1" /> Trang Chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/products">
                <FaList className="me-1" /> Danh Sách Sản Phẩm
              </Nav.Link>
              <Nav.Link as={Link} to="/categories">
                <FaFolder className="me-1" /> Quản Lý Danh Mục
              </Nav.Link>
              <Nav.Link as={Link} to="/analytics">
                <FaChartBar className="me-1" /> Phân Tích
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <Container className="mt-5">
              <Home />
            </Container>
          }
        />
        {/* Trang danh sách sản phẩm */}
        <Route
          path="/products"
          element={
            <Container className="mt-5">
              <h1 className="text-center mb-4">Quản Lý Sản Phẩm</h1>
              <ProductForm />
              <SearchBar />
              <ProductList />
            </Container>
          }
        />
        {/* Trang chi tiết sản phẩm */}
        <Route
          path="/products/:id"
          element={
            <Container className="mt-5">
              <ProductDetail />
            </Container>
          }
        />
        {/* Trang quản lý danh mục */}
        <Route
          path="/categories"
          element={
            <Container className="mt-5">
              <CategoryManager />
            </Container>
          }
        />
        {/* Trang phân tích */}
        <Route
          path="/analytics"
          element={
            <Container className="mt-5">
              <Analytics />
            </Container>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
