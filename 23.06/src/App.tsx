import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: '10px', background: '#f0f0f0' }}>
        <nav>
          <Link to="/" style={{ marginRight: '10px' }}>Товари</Link>
          <Link to="/privacy">Політика конфіденційності</Link>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
