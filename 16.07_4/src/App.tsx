import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <header style={{ padding: '10px', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
          <nav>
            <Link to="/" style={{ marginRight: '10px' }}>Головна</Link>
            <Link to="/privacy" style={{ marginRight: '10px' }}>Політика конфіденційності</Link>
            <Link to="/auth" style={{ marginRight: '10px' }}>Авторизація</Link>
            <Link to="/profile">Профіль</Link>
          </nav>
          <Link to="/cart">Кошик</Link>
        </header>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
