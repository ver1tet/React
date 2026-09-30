import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const ctx = useContext(CartContext);
  if (!ctx) return null;

  const originalTotal = ctx.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const discount = originalTotal > 5000 ? originalTotal * 0.1 : 0;
  const finalTotal = originalTotal - discount;

  return (
    <div>
      <h1>Кошик</h1>
      {ctx.items.length === 0 ? <p>Кошик порожній</p> : (
        <div>
          {ctx.items.map(item => (
            <div key={item.product.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <h4>{item.product.title}</h4>
              <p>Ціна: {item.product.price} ₴</p>
              <button onClick={() => ctx.updateQuantity(item.product.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => ctx.updateQuantity(item.product.id, item.quantity + 1)}>+</button>
            </div>
          ))}
          
          <div style={{ marginTop: '20px', borderTop: '2px solid black', paddingTop: '10px' }}>
            <h3>Разом: {finalTotal} ₴</h3>
            {finalTotal < originalTotal && (
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                Вигода: -₴{discount} <span style={{ textDecoration: 'line-through', color: 'gray' }}>{originalTotal}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
