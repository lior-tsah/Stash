import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/logo.svg';

const Login = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    //   navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    // Redirect initiated; no immediate error handling (handled after callback).
    signInWithGoogle();
  };

  return (
    <div className="login-page">
      <div className="login-card" role="dialog" aria-labelledby="loginHeading">
        <img src={logo} alt="FinBox Logo" className="logo" />
        <h1 id="loginHeading">{mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}</h1>
        <div className="mode-toggle">
          {mode === 'signin' ? (
            <>Need an account?{' '}<button type="button" onClick={() => setMode('signup')}>Sign up</button></>
          ) : (
            <>Already have an account?{' '}<button type="button" onClick={() => setMode('signin')}>Sign in</button></>
          )}
        </div>

        {error && <div className="error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signin' ? '••••••••' : 'At least 6 characters'}
            />
          </div>
          <div className="actions">
            <button className="primary" type="submit" disabled={submitting}>
              {submitting ? (mode === 'signin' ? 'Signing in...' : 'Creating...') : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
            <button type="button" className="google" onClick={handleGoogle} disabled={submitting}>
              <span role="img" aria-label="Google">🔐</span> Continue with Google
            </button>
          </div>
        </form>
        <footer className="note">By continuing you agree to the terms & privacy policy.</footer>
      </div>
    </div>
  );
};

export default Login;
