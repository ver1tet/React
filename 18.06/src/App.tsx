import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: '10px', background: '#f0f0f0' }}>
        <nav>
          <Link to="/" style={{ marginRight: '10px' }}>Головна</Link>
          <Link to="/privacy">Політика конфіденційності</Link>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
