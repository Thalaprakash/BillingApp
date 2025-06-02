import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const foundInvoice = invoices.find((inv) => inv.id === id);
    if (!foundInvoice) {
      alert("Invoice not found");
      navigate("/dashboard/invoices");
      return;
    }
    setInvoice(foundInvoice);
    setItems(foundInvoice.items || []);
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSave = () => {
    const updatedInvoice = { ...invoice, items };
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id ? updatedInvoice : inv
    );
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    alert("Invoice updated successfully!");
    navigate("/dashboard/invoices");
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Edit Invoice #{invoice.invoiceNumber}</h2>

      <div style={styles.formGroup}>
        <label>Client Name:</label>
        <input
          type="text"
          name="billToName"
          value={invoice.billToName}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Client Company:</label>
        <input
          type="text"
          name="billToCompany"
          value={invoice.billToCompany}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Client Address:</label>
        <input
          type="text"
          name="billToAddress"
          value={invoice.billToAddress}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Invoice Date:</label>
        <input
          type="date"
          name="date"
          value={invoice.date}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Tax Rate (%):</label>
        <input
          type="number"
          name="taxRate"
          value={invoice.taxRate}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <h3>Items</h3>
      {items.map((item, index) => (
        <div key={index} style={styles.itemRow}>
          <input
            type="text"
            value={item.description}
            onChange={(e) => handleItemChange(index, "description", e.target.value)}
            placeholder="Description"
            style={styles.input}
          />
          <input
            type="number"
            value={item.amount}
            onChange={(e) => handleItemChange(index, "amount", e.target.value)}
            placeholder="Amount"
            style={styles.input}
          />
          <label>
            <input
              type="checkbox"
              checked={item.taxed}
              onChange={(e) => handleItemChange(index, "taxed", e.target.checked)}
            />
            Taxed
          </label>
        </div>
      ))}

      <button style={styles.addButton} onClick={() => setItems([...items, { description: "", amount: "", taxed: false }])}>
        ➕ Add Item
      </button>

      <br />
      <button style={styles.saveButton} onClick={handleSave}>
        💾 Save Invoice
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  itemRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },
  addButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saveButton: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default EditInvoice;
