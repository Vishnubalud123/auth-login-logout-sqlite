import React from 'react';

export default function Instructions() {
  return (
    <div className='instructions'>
      <h2>Authentication System</h2>
      <p>This is a complete login and logout flow implementation with React.js frontend and Node.js backend using SQLite database.</p>
      <h3>Features:</h3>
      <ul>
        <li>User registration with email and password</li>
        <li>User login with session management</li>
        <li>Protected routes</li>
        <li>Password hashing with bcrypt</li>
        <li>Session-based authentication with cookies</li>
        <li>SQLite database for data storage</li>
      </ul>
      <h3>To run this application:</h3>
      <ol>
        <li>Start the backend server: <code>cd backend && npm install && npm start</code></li>
        <li>Start the frontend: <code>cd frontend && npm install && npm start</code></li>
        <li>Open <code>http://localhost:3000</code></li>
      </ol>
    </div>
  );
}