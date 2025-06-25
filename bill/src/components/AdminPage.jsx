  GNU nano 7.2                                                                                                                                             AdminPage.jsx                                                                                                                                                      
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    if (loggedInUser.role !== 'admin') {
      alert('Access Denied. Admins only.');
      navigate('/');
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://enterprisesmdu.com/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      alert('Failed to load users');
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await axios.patch(`https://enterprisesmdu.com/api/auth/toggle-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      alert('Failed to update user status');
    }
  };
  // Logout and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <h2 style={styles.subHeading}>User Management</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.phone}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={{ ...styles.td, color: user.active ? 'green' : 'red' }}>
                {user.active ? 'Active' : 'Inactive'}
              </td>
              <td style={styles.td}>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: user.active ? '#dc3545' : '#28a745',
                  }}
                  onClick={() => toggleUserStatus(user._id)}
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '32px',
    color: '#343a40',
  },
  logoutButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  subHeading: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#495057',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  th: {
    border: '1px solid #dee2e6',
    padding: '12px',
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '12px',
  },
  button: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default AdminPage;
