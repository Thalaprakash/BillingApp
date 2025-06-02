import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoiceToEdit = storedInvoices.find(
      (inv) => String(inv.id) === String(id)
    );
    if (invoiceToEdit) {
      setInvoice(invoiceToEdit);
    } else {
      console.warn("Invoice not found!");
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] =
      field === "taxed"
        ? value
        : field === "amount" || field === "quantity"
        ? Number(value)
        : value;
    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addNewItem = () => {
    const newItem = {
      description: "",
      amount: 0,
      quantity: 1,
      taxed: false,
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleSave = () => {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const updated = invoices.map((inv) =>
      String(inv.id) === String(id) ? invoice : inv
    );
    localStorage.setItem("invoices", JSON.stringify(updated));
    alert("Invoice updated successfully!");
    navigate("/dashboard/invoices");
  };

  if (!invoice) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Invoice #{invoice.invoiceNumber}</h2>

      <div style={styles.formGroup}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={invoice.date}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Invoice Number</label>
        <input
          name="invoiceNumber"
          value={invoice.invoiceNumber}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Client Company</label>
        <input
          name="billToCompany"
          value={invoice.billToCompany}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Tax Rate (%)</label>
        <input
          type="number"
          name="taxRate"
          value={invoice.taxRate}
          onChange={handleInputChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Status</label>
        <select
          name="status"
          value={invoice.status || "Unpaid"}
          onChange={handleInputChange}
          style={styles.input}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <h3 style={styles.subHeading}>Items</h3>
      {invoice.items.map((item, index) => (
        <div key={index} style={styles.itemContainer}>
          <input
            style={styles.input}
            value={item.description}
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
            placeholder="Description"
          />
          <input
            type="number"
            style={styles.input}
            value={item.amount}
            onChange={(e) => handleItemChange(index, "amount", e.target.value)}
            placeholder="Amount"
          />
          <input
            type="number"
            style={styles.input}
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(index, "quantity", e.target.value)
            }
            placeholder="Quantity"
          />
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="checkbox"
              checked={item.taxed}
              onChange={(e) =>
                handleItemChange(index, "taxed", e.target.checked)
              }
            />
            Taxed
          </label>
        </div>
      ))}

      <button style={styles.addItemButton} onClick={addNewItem}>
        ➕ Add More Item
      </button>

      <button style={styles.saveButton} onClick={handleSave}>
        💾 Save Invoice
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#fdfdfd",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: "#2c3e50",
  },
  subHeading: {
    fontSize: "20px",
    marginTop: "30px",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  formGroup: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  itemContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  saveButton: {
    marginTop: "30px",
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  addItemButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
  },
};

export default EditInvoice;
