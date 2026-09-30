import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal';

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
  
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '' });

  const isForgotValid = email.trim() !== '' && birthDate.trim() !== '';
  const isLoginValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Симуляція затримки мережі
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'forgot') {
        setAlertConfig({
          isOpen: true,
          title: 'Успіх',
          message: `Інструкції для відновлення паролю відправлені на ${email}`
        });
      } else {
        localStorage.setItem('user', email);
        navigate('/profile');
      }
    }, 1500);
  };

  const handleCloseAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
    if (mode === 'forgot') {
      setMode('login');
      setPassword('');
      setBirthDate('');
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        onClose={handleCloseAlert} 
      />
      
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', position: 'relative', borderRadius: '8px' }}>
        
        {isLoading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10,
            borderRadius: '8px'
          }}>
            <div style={{ 
              width: '40px', height: '40px', border: '4px solid #f3f3f3', 
              borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' 
            }} />
          </div>
        )}

        <h2>{mode === 'login' ? 'Вхід' : 'Забули пароль'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Електронна пошта" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          
          {mode === 'login' ? (
            <input 
              type="password" 
              placeholder="Пароль" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          ) : (
            <input 
              type="date" 
              value={birthDate} 
              onChange={e => setBirthDate(e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          )}
          
          <button 
            type="submit" 
            disabled={mode === 'login' ? !isLoginValid : !isForgotValid}
            style={{ 
              padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px',
              cursor: (mode === 'login' ? !isLoginValid : !isForgotValid) ? 'not-allowed' : 'pointer',
              opacity: (mode === 'login' ? !isLoginValid : !isForgotValid) ? 0.6 : 1
            }}
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
          style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >
          {mode === 'login' ? 'Забули пароль?' : 'Повернутись до входу'}
        </button>
      </div>
    </>
  );
}
