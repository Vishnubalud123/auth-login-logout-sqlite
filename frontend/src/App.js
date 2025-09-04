import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Instructions from './components/Instructions';
import axios from 'axios';

function App() {
  const [view, setView] = useState('login');
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    window.showLogin = () => setView('login');
    window.showRegister = () => setView('register');
    // check session
    axios.get('http://localhost:5000/api/auth/user', { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, [setCurrentUser]);

  const renderView = () => {
    if (currentUser) return <Dashboard />;
    if (view === 'login') return <Login />;
    return <Register />;
  };

  return (
    <div>
      <header style={{ background: '#2c3e50', color: 'white', padding: 20, textAlign: 'center' }}>
        <h1>React.js & Node.js Authentication System</h1>
        <p>Complete login and logout flow with session management</p>
      </header>
      <div className='container'>
        <Instructions />
        <div style={{ flex: 2 }}>{renderView()}</div>
      </div>
    </div>
  );
}

export default App;