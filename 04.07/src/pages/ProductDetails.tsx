import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../dal/api';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p.id === id);
  const ctx = useContext(CartContext);

  if (!product) return <h2>Товар не знайдено</h2>;

  return (
    <div>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: 'blue' }}>
        ← Назад до списку
      </Link>
      <h1>{product.title}</h1>
      <p style={{ color: 'gray' }}>ID: {product.id}</p>
      {product.imageUrl && <img src={product.imageUrl} alt={product.title} style={{ maxWidth: '300px', display: 'block', margin: '20px 0' }} />}
      <h2>Ціна: {product.price} ₴</h2>
      {product.description && <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{product.description}</p>}
      <button onClick={() => ctx?.addToCart(product)} style={{ padding: '10px 20px', cursor: 'pointer', background: 'blue', color: 'white', border: 'none' }}>
        Додати до кошика
      </button>
    </div>
  );
}
