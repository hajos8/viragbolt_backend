/* npm i react-router-dom react-router react-bootstrap bootstrap express mysql2 cory */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import OpenPage from "./pages/OpenPage.jsx";
import Order from "./pages/Order.jsx";
import Flowers from "./pages/Flowers.jsx";

import './style.css';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<OpenPage />} />
          <Route path="//rendeles" element={<Order />} />
          <Route path="/flowers" element={<Flowers />} />
        </Routes>
      </Router>
    </>
  );
}
