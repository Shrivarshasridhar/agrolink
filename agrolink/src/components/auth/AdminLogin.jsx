import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/admin/login', {
        username,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');  
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px 30px', borderRadius: '8px', boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Admin Login</h2>
        {error && (
          <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: '500' }}>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" style={{ padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }} />
          <label style={{ marginBottom: '5px', fontWeight: '500' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" style={{ padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }} />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', fontWeight: '600', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;