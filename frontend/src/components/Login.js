import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
      setCurrentUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>Log In</h2>
        {error && <div className='error-message'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</button>
        </form>
        <div className='auth-link'>Don't have an account? <a href='#' onClick={()=>window.showRegister()}>Sign Up</a></div>
      </div>
    </div>
  );
}