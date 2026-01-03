import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Handles redirect back from server OAuth provider. Expects ?token=... in URL.
const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      (async () => {
        await refreshUser();
        navigate('/', { replace: true });
      })();
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, refreshUser]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Processing authentication...
    </div>
  );
};

export default OAuthCallback;
