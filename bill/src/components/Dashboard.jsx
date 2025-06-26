import React, { useContext, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user._id) {
        try {
          const res = await axios.get(`http://147.93.28.207:3001/users/${user._id}`);
          if (res.data) {
            
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));

            const userId = res.data._id;
            const defaults = {
              [`invoices_${userId}`]: [],
              [`logo_${userId}`]: null,
              [`signature_${userId}`]: null,
            };

            for (const [key, value] of Object.entries(defaults)) {
              if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(value));
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

 fetchUserData();
  }, [user?._id, setUser]);

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>My Dashboard</h2>
        <ul style={styles.navList}>
          <NavItem to="/dashboard" label="🏠 Home" active={isActive("/dashboard")} />
          <NavItem to="/dashboard/invoices" label="🧾 Invoices" active={isActive("/dashboard/invoices")} />
          <NavItem to="/dashboard/create-invoice" label="➕ Create" active={isActive("/dashboard/create-invoice")} />
          <NavItem to="/dashboard/settings" label="⚙️ Settings" active={isActive("/dashboard/settings")} />
        </ul>
      </aside>

      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          {user && user.username ? (
            <div style={styles.userGreeting}>
              <span style={styles.userInitial}>{getUserInitial(user.username)}</span>
            </div>
          ) : null}

          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </header>
        
        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, label, active }) => (
  <li style={styles.navItem}>
    <Link
      to={to}
      style={{
        ...styles.navLink,
        ...(active ? styles.activeNavLink : {}),
      }}
    >
      {label}
    </Link>
  </li>
);

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(to right, #f6f8fc, #eef2f7)",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(160deg, #6a11cb 0%, #2575fc 100%)",
    color: "#fff",
    padding: "30px 20px",
    boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)",
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
  },
  sidebarHeader: {
    fontSize: "22px",
    marginBottom: "30px",
    fontWeight: "600",
    textAlign: "center",
    background: "rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "12px",
  },
  navList: { listStyleType: "none", padding: 0, margin: 0 },
  navItem: { marginBottom: "16px" },
  navLink: {
    color: "#e0e0ff",
    textDecoration: "none",
    fontSize: "16px",
    padding: "12px 18px",
    borderRadius: "12px",
    display: "block",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.05)",
  },
  activeNavLink: {
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    color: "#333",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  contentWrapper: { flex: 1, display: "flex", flexDirection: "column" },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "20px 40px 10px 40px",
    backgroundColor: "#f7f9fc",
    alignItems: "center",
  },
  userGreeting: { marginRight: "15px", fontSize: "18px", fontWeight: "bold" },
   userInitial: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "center",
    lineHeight: "30px",
    fontSize: "16px",
  },
  logoutButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    background: "#ff4b5c",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#f7f9fc",
    
    borderRadius: "12px",
    boxShadow: "inset 0 0 10px #e3e7ed",
    margin: "0 20px 20px 20px",
  },
};

export default Dashboard;