import React, { useState, useEffect } from 'react';
import InvoiceList from '../components/InvoiceList';
import CustomerList from '../components/Customers';

const Home = () => {
  const [section, setSection] = useState('home');
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    setInvoices(savedInvoices);

    const savedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(savedCustomers);

    const showInvoice = localStorage.getItem('showInvoiceList');
    if (showInvoice === 'true') {
      setSection('invoice');
      localStorage.removeItem('showInvoiceList');
    }
  }, []);

  const handleSectionClick = (sectionName) => {
    setSection(sectionName);
  };

  const invoiceStats = () => {
    const total = invoices.length;
    let paidCount = 0;
    let unpaidCount = 0;

    invoices.forEach((inv) => {
      if (inv.status?.toLowerCase() === 'paid') {
        paidCount++;
      } else {
        unpaidCount++;
      }
    });

    return { total, paidCount, unpaidCount };
  };

  const { total, paidCount, unpaidCount } = invoiceStats();

  const renderSection = () => {
    switch (section) {
      case 'invoice':
        return (
          <div>
            <button onClick={() => handleSectionClick('home')} style={styles.backBtn}>
              ⬅ Back
            </button>
            <InvoiceList />
          </div>
        );
      case 'customer':
        return (
          <div>
            <button onClick={() => handleSectionClick('home')} style={styles.backBtn}>
              ⬅ Back
            </button>
            <CustomerList />
          </div>
        );
      default:
        return (
          <div style={styles.homeContainer}>
            <h1 style={styles.heading}>📊 Dashboard</h1>
            <p style={styles.subtext}>Overview of your business</p>

            <div style={styles.summaryContainer}>
              <div style={{ ...styles.summaryCard, background: '#3498db' }}>
                <h3>Total Invoices</h3>
                <p>{total}</p>
              </div>
              <div style={{ ...styles.summaryCard, background: '#2ecc71' }}>
                <h3>Paid Invoices</h3>
                <p>{paidCount}</p>
              </div>
              <div style={{ ...styles.summaryCard, background: '#e74c3c' }}>
                <h3>Unpaid Invoices</h3>
                <p>{unpaidCount}</p>
              </div>
              <div style={{ ...styles.summaryCard, background: '#9b59b6' }}>
                <h3>Total Customers</h3>
                <p>{customers.length}</p>
              </div>
            </div>

            <p style={{ fontSize: '18px', marginTop: '20px' }}>Choose a section:</p>
            <button onClick={() => handleSectionClick('invoice')} style={styles.optionBtn}>
              📄 View Invoice List
            </button>
            <button onClick={() => handleSectionClick('customer')} style={styles.optionBtn}>
              👥 View Customer List
            </button>
          </div>
        );
    }
  };

  return <div>{renderSection()}</div>;
};

const styles = {
  homeContainer: {
    textAlign: 'center',
    padding: '40px',
    background: '#f4f6f8',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  subtext: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  optionBtn: {
    margin: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    transition: 'background 0.3s ease',
  },
  backBtn: {
    margin: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#7f8c8d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  summaryContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  summaryCard: {
    color: '#fff',
    padding: '20px',
    borderRadius: '12px',
    width: '200px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
};

export default Home;
