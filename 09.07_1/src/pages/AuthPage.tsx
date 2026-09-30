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

  const isForgotValid = email.trim() !== '' && birthDate.trim() !== '';
  const isLoginValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      alert(`Відновлення паролю на ${email}`);
    } else {
      localStorage.setItem('user', email);
      navigate('/profile');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>
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
