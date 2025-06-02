import React from "react";
import { Link } from "react-router-dom";

// Inline styles for the sidebar
const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "20px",
    position: "fixed",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  navList: {
    listStyle: "none",
    padding: "0",
  },
  navItem: {
    marginBottom: "15px",
  },
  navLink: {
    textDecoration: "none",
    color: "#ecf0f1",
    fontSize: "18px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

// Sidebar component
const Sidebar = () => {
  return (
    <nav style={styles.sidebar}>
      <h2 style={styles.sidebarHeader}>Dashboard</h2>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/invoices" style={styles.navLink}>
            Invoices
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/customers" style={styles.navLink}>
            Customers
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/reports" style={styles.navLink}>
            Reports
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/settings" style={styles.navLink}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
