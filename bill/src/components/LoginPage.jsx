  GNU nano 7.2                                                                                       LoginPage.jsx                                                                                                 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post('https://enterprisesmdu.com/api/auth/login', form, {
        withCredentials: true,
      });

      const userData = res.data.user;

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.formWrapper}>
        <div
          style={styles.iconWrapper}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i className="fas fa-sign-in-alt" style={styles.icon}></i>
        </div>

        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
          <p style={styles.linkText}>
            Don't have an account? <Link to="/ " style={styles.link}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url("/1188493.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom right, rgba(0,0,20,0.4), rgba(0,0,40,0.7))',
    zIndex: 1,
  },
  formWrapper: {
    position: 'relative',
    zIndex: 2,
    width: '360px',
    padding: '30px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  iconWrapper: {
    width: '72px',
    height: '72px',
    margin: '0 auto 25px',
    borderRadius: '50%',
    background: 'rgba(0, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.5), 0 0 5px rgba(0, 255, 255, 0.2) inset',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  icon: {
    fontSize: '30px',
    color: '#ffffff',
    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  linkText: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#00c6ff',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
