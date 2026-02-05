import { useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";

type Product = {
  id: number;
  title: string;
  category: string;
};

function App() {
  const [name, setName] = useState("Nak dev");
  const inputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">หน้าแรก</Link>
        <Link to="/about">เกี่ยวกับเรา</Link>
        <Link to="/product">สินค้า</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/product" element={<Product />}></Route>
      </Routes>
      <>
        {/* useState */}
        <h1>สวัสดี นี่คือ {name}</h1>
        <input
          type="text"
          placeholder="พิมพ์ชื่อใหม่..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* useRef */}
        <input
          ref={inputRef}
          type="text"
          placeholder="พิมพ์ชื่อใหม่..."
          onChange={(e) => setName(e.target.value)}
        />

        <ul>
          {products.map((p) => (
            <li key={p.id}>{p.category}</li>
          ))}
        </ul>
      </>
    </BrowserRouter>
  );
}

export default App;
