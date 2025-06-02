import React, { useEffect, useState } from 'react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(stored);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👥 Customer List</h2>
      {customers.length === 0 ? (
        <p style={styles.empty}>No customers found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr key={index}>
                <td>{cust.name || '-'}</td>
                <td>{cust.email || '-'}</td>
                <td>{cust.company || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    background: '#fff',
    maxWidth: '900px',
    margin: 'auto',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  empty: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
    padding: '40px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    background: '#f5f5f5',
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
};

export default CustomerList;
