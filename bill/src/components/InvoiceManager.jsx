// src/components/InvoiceManager.jsx
import React, { useState } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";

const InvoiceManager = () => {
  // State to hold all invoices
  const [invoices, setInvoices] = useState([]);

  // Callback to add a new invoice
  const addInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Invoice Manager</h1>
      {/* Pass the callback to InvoiceForm */}
      <InvoiceForm onAddInvoice={addInvoice} />

      {/* Pass the invoices to InvoiceList */}
      <InvoiceList invoices={invoices} />
    </div>
  );
};

export default InvoiceManager;
