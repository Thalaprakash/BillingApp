import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import EditInvoice from "./components/EditInvoice";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// Create auth context to provide user info globally
export const AuthContext = createContext();

// ProtectedRoute component that redirects unauthenticated or unauthorized users
const ProtectedRoute = ({ role }) => {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // If user not logged in, save last path and redirect to login
  if (!storedUser) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to login (or you can redirect to unauthorized page)
  if (role && storedUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // If authorized, render child routes
  return <Outlet />;
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on app mount
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignupPage setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="create-invoice" element={<InvoiceForm />} />
              <Route path="/dashboard/edit-invoice/:id" element={<EditInvoice />} />

              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback Route - Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
