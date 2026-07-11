import { Link } from 'react-router-dom';
import { mockProducts } from '../dal/api';

export default function Products() {
  return (
    <div>
      <h1>Список товарів</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {mockProducts.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '100%' }}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Нема фото</div>
              )}
              
              <h3 style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {p.title} - Це дуже довга назва, яка має обов'язково займати більше ніж два рядки, щоб ми могли чітко побачити, чи працює обрізка тексту з трьома крапками наприкінці.
              </h3>
              
              <p style={{ fontWeight: 'bold' }}>Ціна: {p.price} ₴</p>
              
              {p.description && (
                <p style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#555'
                }}>
                  {p.description} - Цей опис спеціально зроблений дуже довгим, щоб він точно займав більше ніж три рядки. Тут ми маємо побачити, як працює властивість CSS line-clamp, яка автоматично обрізає довгий текст і додає три крапки в кінці третього рядка, щоб зберігати компактність карток товарів у сітці.
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
