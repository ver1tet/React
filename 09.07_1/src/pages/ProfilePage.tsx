import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      navigate('/auth');
    } else {
      setUser(loggedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleDeleteProfile = () => {
    if (confirmDelete) {
      localStorage.removeItem('user');
      alert('Профіль видалено відповідно до GDPR Art 17.');
      navigate('/auth');
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Кабінет користувача</h2>
      <p>Вітаємо, {user}!</p>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Вийти з облікового запису
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ffcccc', background: '#fff0f0', borderRadius: '8px' }}>
        <h3 style={{ color: '#d9534f', marginTop: 0 }}>Небезпечна зона</h3>
        <p>Видалення профілю є незворотним процесом.</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="checkbox" 
            checked={confirmDelete} 
            onChange={(e) => setConfirmDelete(e.target.checked)} 
          />
          Я підтверджую видалення свого профілю та всіх пов'язаних даних
        </label>
        <button 
          onClick={handleDeleteProfile} 
          disabled={!confirmDelete}
          style={{ 
            padding: '8px 16px', 
            background: confirmDelete ? '#d9534f' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: confirmDelete ? 'pointer' : 'not-allowed' 
          }}
        >
          Видалити профіль
        </button>
      </div>
    </div>
  );
}
