import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await axios.post('https://auth-login-logout-sqlite.onrender.com/api/auth/register', { email, password }, { withCredentials: true });
      setCurrentUser(res.data.user);
      setSuccess('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>Sign Up</h2>
        {error && <div className='error-message'>{error}</div>}
        {success && <div className='success-message'>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Confirm Password</label>
            <input type='password' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
          </div>
          <button disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className='auth-link'>Have an account? <a href='#' onClick={()=>window.showLogin()}>Log In</a></div>
      </div>
    </div>
  );
}
