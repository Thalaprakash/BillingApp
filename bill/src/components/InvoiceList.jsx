import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage, setInvoicesPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For view details modal

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);
    setFilteredInvoices(savedInvoices);
    setCompanyLogo(localStorage.getItem("companyLogo"));
    setSignatureImage(localStorage.getItem("signatureImage"));
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.includes(searchQuery) ||
        (invoice.billToCompany &&
          invoice.billToCompany.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchQuery, invoices]);

  const handleDelete = (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  const calculateSubtotal = (invoice) =>
    invoice.items?.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0) * (item.quantity || 1),
      0
    ) || 0;

  const calculateTax = (invoice, taxRate) => {
    const taxable = invoice.items?.reduce(
      (sum, item) =>
        item.taxed
          ? sum + parseFloat(item.amount || 0) * (item.quantity || 1)
          : sum,
      0
    );
    return (taxable * taxRate) / 100;
  };

  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const companyName = localStorage.getItem("companyName") || "Your Company Name";
    const companyAddress = localStorage.getItem("companyAddress") || "Your Company Address";
    const companyPhone = localStorage.getItem("companyPhone") || "Your Company Phone";
    const bankName = localStorage.getItem("bankName") || "Bank Name";
    const accountNumber = localStorage.getItem("accountNumber") || "Account Number";
    const ifscCode = localStorage.getItem("ifscCode") || "IFSC Code";
    const upiId = localStorage.getItem("upiId") || "UPI ID";

    const billToName = invoice.billToName || invoice.clientName || "Client Name";
    const billToCompany = invoice.billToCompany || invoice.clientCompany || "Client Company";
    const billToAddress =
      invoice.billToAddress ||
      invoice.clientAddress ||
      invoice.address ||
      "Client Address";

    let y = 20;

    if (companyLogo) {
      const imgProps = doc.getImageProperties(companyLogo);
      const imgWidth = 50;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      doc.addImage(companyLogo, "PNG", pageWidth - imgWidth - 10, y, imgWidth, imgHeight);
    }

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(companyName, 14, y);
    doc.setFontSize(11);
    doc.text(companyAddress, 14, y + 8);
    doc.text(companyPhone, 14, y + 14);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Invoice #${invoice.invoiceNumber}`, 14, y + 30);
    doc.setFontSize(11);
    doc.text(`Date: ${invoice.date}`, 14, y + 38);

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Bill To:", 14, y + 48);
    doc.setTextColor(0);
    doc.text(billToName, 14, y + 56);
    doc.text(billToCompany, 14, y + 62);
    doc.text(billToAddress, 14, y + 70);

    const tableData =
      invoice.items?.map((item, index) => {
        const quantity = item.quantity || 1;
        const unitPrice = parseFloat(item.amount || 0);
        const totalAmount = unitPrice * quantity;
        return [
          index + 1,
          item.description,
          quantity,
          unitPrice.toFixed(2),
          totalAmount.toFixed(2),
          item.taxed ? "Yes" : "No",
        ];
      }) || [];

    autoTable(doc, {
      startY: y + 75,
      head: [["#", "Description", "Qty", "Unit Price", "Total", "Taxed"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 11,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 20,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 60 },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 20, halign: "center" },
      },
    });

    const subtotal = calculateSubtotal(invoice);
    const taxRate = parseFloat(invoice.taxRate || 0);
    const totalTax = calculateTax(invoice, taxRate);
    const total = subtotal + totalTax;

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Summary", "Amount"]],
      body: [
        ["Subtotal", subtotal.toFixed(2)],
        [`Tax (${taxRate}%)`, totalTax.toFixed(2)],
        ["Total", total.toFixed(2)],
      ],
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 10,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: "right" },
      },
    });

    const bankDetailsY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text("Bank Details", 14, bankDetailsY);
    doc.setTextColor(0);
    doc.text(`Bank Name: ${bankName}`, 14, bankDetailsY + 8);
    doc.text(`Account Number: ${accountNumber}`, 14, bankDetailsY + 16);
    doc.text(`IFSC Code: ${ifscCode}`, 14, bankDetailsY + 24);
    doc.text(`UPI ID: ${upiId}`, 14, bankDetailsY + 32);

    if (signatureImage) {
      doc.setTextColor(80);
      doc.text("Authorized Signature", pageWidth - 60, bankDetailsY + 20);
      const sigProps = doc.getImageProperties(signatureImage);
      const sigHeight = (30 / sigProps.width) * sigProps.height;
      doc.addImage(signatureImage, "PNG", pageWidth - 60, bankDetailsY + 25, 40, sigHeight);
    }

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const handleEdit = (invoiceId) => {
    navigate(`/dashboard/edit-invoice/${invoiceId}`);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };

  // Pagination setup
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleBack = () => navigate(-1);

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backBtn}>
        ⬅ Back
      </button>

      <h2 style={styles.heading}>Invoices</h2>

      <div style={styles.headerActions}>
        <div style={{ marginLeft: "auto" }}>
          <button
            style={styles.createInvoiceButton}
            onClick={() => navigate("/dashboard/create-invoice")}
          >
            ➕ Create New Invoice
          </button>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by invoice number or client name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={styles.rowsPerPageContainer}>
        <label>Show: </label>
        <select
          value={invoicesPerPage}
          onChange={(e) => {
            setInvoicesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Invoice #</th>
            <th style={styles.th}>Client</th>
            <th style={styles.th}>Amount (Subtotal + GST)</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((inv) => (
            <tr key={inv.id} style={styles.row}>
              <td style={styles.td}>{inv.date}</td>
              <td style={styles.td}>{inv.invoiceNumber}</td>
              <td style={styles.td}>{inv.billToCompany}</td>
              <td style={styles.td}>
                ₹
                {(
                  calculateSubtotal(inv) +
                  calculateTax(inv, parseFloat(inv.taxRate || 0))
                ).toFixed(2)}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  title="Download PDF"
                  onClick={() => handleDownloadPDF(inv)}
                >
                  ⬇️
                </button>
                <button
                  style={styles.editButton}
                  title="Edit Invoice"
                  onClick={() => handleEdit(inv.id)}
                >
                  ✏️
                </button>
                <button
                  style={styles.deleteButton}
                  title="Delete Invoice"
                  onClick={() => handleDelete(inv.id)}
                >
                  🗑️
                </button>
                <button
                  style={styles.button}
                  title="View Details"
                  onClick={() => handleViewDetails(inv)}
                >
                  👁️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={styles.pagination}>
        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(Math.ceil(filteredInvoices.length / invoicesPerPage))].map((_, idx) => (
          <button
            key={idx + 1}
            style={{
              ...styles.pageButton,
              fontWeight: currentPage === idx + 1 ? "bold" : "normal",
            }}
            onClick={() => paginate(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage)}
        >
          Next
        </button>
      </div>

      {/* Modal for viewing invoice details */}
      {selectedInvoice && (
        <div style={styles.detailModalOverlay}>
          <div style={styles.detailModal}>
            <h3>Invoice Details - #{selectedInvoice.invoiceNumber}</h3>
            <p>
              <b>Client:</b> {selectedInvoice.billToCompany}
            </p>
            <p>
              <b>Date:</b> {selectedInvoice.date}
            </p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Taxed</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity || 1}</td>
                    <td>₹{parseFloat(item.amount).toFixed(2)}</td>
                    <td>₹{((item.quantity || 1) * parseFloat(item.amount)).toFixed(2)}</td>
                    <td>{item.taxed ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.closeButton} onClick={handleCloseDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  backBtn: {
    marginBottom: 15,
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  heading: {
    textAlign: "center",
    marginBottom: 20,
  },
  headerActions: {
    display: "flex",
    marginBottom: 10,
  },
  createInvoiceButton: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 15,
    textAlign: "center",
  },
  searchInput: {
    width: "80%",
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  rowsPerPageContainer: {
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  select: {
    padding: 6,
    fontSize: 14,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 15,
  },
  th: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    verticalAlign: "middle",
  },
  button: {
    margin: "0 4px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "5px 8px",
    fontSize: 14,
  },
  editButton: {
    margin: "0 4px",
    cursor: "pointer",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "5px 8px",
    fontSize: 14,
  },
  deleteButton: {
    margin: "0 4px",
    cursor: "pointer",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "5px 8px",
    fontSize: 14,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  pageButton: {
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  detailModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  detailModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    maxWidth: 700,
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  closeButton: {
    marginTop: 15,
    padding: "8px 15px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default InvoiceList;