import { useState } from 'react';
import axios from 'axios';
import { Sparkles, ArrowRight } from 'lucide-react';
import './Auth.css';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(endpoint, payload);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1 className="text-gradient">Lumina AI</h1>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back to the future of creation' : 'Start your creative journey'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="creative_mind"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="text-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
