import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../config/firebase';
import { getFirebaseErrorMessage } from '../utils/errorHandler';
import '../styles/AuthForm.css';

function SignIn({ onSignInSuccess, onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      setEmail('');
      setPassword('');
      toast.success('Welcome back! 👋');
      if (onSignInSuccess) {
        onSignInSuccess(userCredential.user);
      }
    } catch (err) {
      const friendlyMessage = getFirebaseErrorMessage(err);
      setError(friendlyMessage);
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>Don't have an account?</p>
          <button onClick={onToggleForm} className="toggle-btn">
            Create one now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
