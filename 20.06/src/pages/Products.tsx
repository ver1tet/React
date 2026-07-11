import { mockProducts } from '../dal/api';

export default function Products() {
  return (
    <div>
      <h1>Список товарів</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {mockProducts.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', height: '100%' }}>
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '1/1', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Нема фото</div>
            )}
            <h3>{p.title}</h3>
            <p style={{ color: 'gray', fontSize: '12px' }}>ID: {p.id}</p>
            <p style={{ fontWeight: 'bold' }}>Ціна: {p.price} ₴</p>
            {p.description && <p>{p.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
