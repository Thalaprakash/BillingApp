import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setCompanyName(localStorage.getItem("companyName") || "");
    setCompanyAddress(localStorage.getItem("companyAddress") || "");
    setCompanyPhone(localStorage.getItem("companyPhone") || "");
    setBankName(localStorage.getItem("bankName") || "");
    setAccountNumber(localStorage.getItem("accountNumber") || "");
    setIfscCode(localStorage.getItem("ifscCode") || "");
    setUpiId(localStorage.getItem("upiId") || "");
    setCompanyLogo(localStorage.getItem("companyLogo"));
    setSignatureImage(localStorage.getItem("signatureImage"));
  }, []);

  const handleImageUpload = (e, setter, storageKey) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setter(base64);
      localStorage.setItem(storageKey, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyAddress", companyAddress);
    localStorage.setItem("companyPhone", companyPhone);
    localStorage.setItem("bankName", bankName);
    localStorage.setItem("accountNumber", accountNumber);
    localStorage.setItem("ifscCode", ifscCode);
    localStorage.setItem("upiId", upiId);
    alert("✅ Profile Saved Successfully!");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("companyName");
      localStorage.removeItem("companyAddress");
      localStorage.removeItem("companyPhone");
      localStorage.removeItem("bankName");
      localStorage.removeItem("accountNumber");
      localStorage.removeItem("ifscCode");
      localStorage.removeItem("upiId");
      localStorage.removeItem("companyLogo");
      localStorage.removeItem("signatureImage");

      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backBtn}>⬅ Back</button>

      <h2 style={styles.heading}>⚙️ Settings</h2>

      <label style={styles.label}>Upload Company Logo (PNG):</label>
      <input
        style={styles.fileInput}
        type="file"
        accept="image/png"
        onChange={(e) => handleImageUpload(e, setCompanyLogo, "companyLogo")}
      />
      {companyLogo && <img src={companyLogo} alt="Company Logo" style={styles.previewImage} />}

      <label style={styles.label}>Company Name:</label>
      <input style={styles.input} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

      <label style={styles.label}>Company Address:</label>
      <input style={styles.input} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />

      <label style={styles.label}>Company Phone:</label>
      <input style={styles.input} value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />

      <label style={styles.label}>Bank Name:</label>
      <input style={styles.input} value={bankName} onChange={(e) => setBankName(e.target.value)} />

      <label style={styles.label}>Account Number:</label>
      <input style={styles.input} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />

      <label style={styles.label}>IFSC Code:</label>
      <input style={styles.input} value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />

      <label style={styles.label}>UPI ID:</label>
      <input style={styles.input} value={upiId} onChange={(e) => setUpiId(e.target.value)} />

      <label style={styles.label}>Upload Signature (PNG):</label>
      <input
        style={styles.fileInput}
        type="file"
        accept="image/png"
        onChange={(e) => handleImageUpload(e, setSignatureImage, "signatureImage")}
      />
      {signatureImage && <img src={signatureImage} alt="Signature" style={styles.previewImage} />}

      <button style={styles.button} onClick={handleSave}>💾 Save Settings</button>

      <button style={styles.logoutButton} onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#34495e",
  },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    backgroundColor: "#dfe6e9",
    color: "#2d3436",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    marginTop: "16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3436",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    marginBottom: "10px",
  },
  fileInput: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  previewImage: {
    width: "100px",
    height: "auto",
    marginTop: "10px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
  },
  button: {
    margin: "25px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#6c5ce7",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logoutButton: {
    margin: "20px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#ff4d4d",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Settings;
