import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/profile');
    }
  }, [navigate]);

  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isForgotValid = email.trim() !== '' && birthDate.trim() !== '';
  const isLoginValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Симуляція затримки мережі (прелоадер)
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'forgot') {
        alert(`Відновлення паролю на ${email}`);
      } else {
        localStorage.setItem('user', email);
        navigate('/profile');
      }
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', position: 'relative' }}>
      
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10
        }}>
          <div style={{ 
            width: '40px', height: '40px', border: '4px solid #f3f3f3', 
            borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' 
          }} />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      )}

      <h2>{mode === 'login' ? 'Вхід' : 'Забули пароль'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Електронна пошта" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={{ padding: '8px' }}
        />
        
        {mode === 'login' ? (
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ padding: '8px' }}
          />
        ) : (
          <input 
            type="date" 
            value={birthDate} 
            onChange={e => setBirthDate(e.target.value)} 
            style={{ padding: '8px' }}
          />
        )}
        
        <button 
          type="submit" 
          disabled={mode === 'login' ? !isLoginValid : !isForgotValid}
          style={{ padding: '10px', background: '#007bff', color: 'white', cursor: (mode === 'login' ? !isLoginValid : !isForgotValid) ? 'not-allowed' : 'pointer' }}
        >
          {mode === 'login' ? 'Увійти' : 'Відновити'}
        </button>
      </form>
      
      <button 
        onClick={() => {
          setMode(mode === 'login' ? 'forgot' : 'login');
          setEmail('');
          setPassword('');
          setBirthDate('');
        }}
        style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {mode === 'login' ? 'Забули пароль?' : 'Повернутись до входу'}
      </button>
    </div>
  );
}
