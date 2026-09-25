"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface PurchaseReturnItem {
  id: string;
  returnNo: string;
  originalInvoiceNo: string;
  supplierName: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalRefundAmount: number;
  reason: "DAMAGED_ITEMS" | "NEAR_EXPIRY" | "WRONG_DELIVERY" | "DEFECTIVE_PACKAGING";
  settlementType: "DUE_ADJUSTMENT" | "CASH_REFUND" | "BANK_REFUND";
  date: string;
  status: "SETTLED" | "PENDING_APPROVAL";
}

const initialReturns: PurchaseReturnItem[] = [
  {
    id: "pr-1",
    returnNo: "PR-2026-001",
    originalInvoiceNo: "PO-2026-001",
    supplierName: "Meghna Group Ltd",
    productName: "Soyabean Oil 5 Litre (Leaking Cans)",
    sku: "OIL-SOY-5L",
    quantity: 4,
    unitCost: 760,
    totalRefundAmount: 3040,
    reason: "DAMAGED_ITEMS",
    settlementType: "DUE_ADJUSTMENT",
    date: "2026-09-24",
    status: "SETTLED",
  },
  {
    id: "pr-2",
    returnNo: "PR-2026-002",
    originalInvoiceNo: "PO-2026-002",
    supplierName: "ACI Consumer Care",
    productName: "Radhuni Turmeric Powder 200g",
    sku: "RAD-TUR-200G",
    quantity: 12,
    unitCost: 92,
    totalRefundAmount: 1104,
    reason: "NEAR_EXPIRY",
    settlementType: "DUE_ADJUSTMENT",
    date: "2026-09-25",
    status: "PENDING_APPROVAL",
  },
];

export default function PurchaseReturnsPage() {
  const [returnsList, setReturnsList] = useState<PurchaseReturnItem[]>(initialReturns);
  const [search, setSearch] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);

  // New Return State
  const [newReturn, setNewReturn] = useState({
    originalInvoiceNo: "PO-2026-001",
    supplierName: "Meghna Group Ltd",
    productName: "Miniket Rice 25kg",
    sku: "RICE-MIN-25",
    quantity: 2,
    unitCost: 1650,
    reason: "DAMAGED_ITEMS" as "DAMAGED_ITEMS" | "NEAR_EXPIRY" | "WRONG_DELIVERY",
    settlementType: "DUE_ADJUSTMENT" as "DUE_ADJUSTMENT" | "CASH_REFUND",
  });

  // Selected for Debit Note Voucher Print
  const [selectedDebitNote, setSelectedDebitNote] = useState<PurchaseReturnItem | null>(null);

  // Handle Add Return
  const handleAddReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const refundTotal = newReturn.quantity * newReturn.unitCost;

    const created: PurchaseReturnItem = {
      id: `pr-${Date.now()}`,
      returnNo: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      originalInvoiceNo: newReturn.originalInvoiceNo,
      supplierName: newReturn.supplierName,
      productName: newReturn.productName,
      sku: newReturn.sku,
      quantity: Number(newReturn.quantity),
      unitCost: Number(newReturn.unitCost),
      totalRefundAmount: refundTotal,
      reason: newReturn.reason as any,
      settlementType: newReturn.settlementType as any,
      date: new Date().toISOString().split("T")[0],
      status: "SETTLED",
    };

    setReturnsList([created, ...returnsList]);
    setShowReturnModal(false);
  };

  // Export CSV
  const handleExportCsv = () => {
    exportToCsv({
      filename: "Supplier_Purchase_Returns_Report",
      headers: [
        { key: "returnNo", label: "Debit Note / Return No" },
        { key: "originalInvoiceNo", label: "Original PO No" },
        { key: "supplierName", label: "Supplier Name" },
        { key: "productName", label: "Returned Item" },
        { key: "quantity", label: "Quantity" },
        { key: "unitCost", label: "Unit Cost (BDT)" },
        { key: "totalRefundAmount", label: "Total Refund / Deduction (BDT)" },
        { key: "reason", label: "Return Reason" },
        { key: "settlementType", label: "Settlement Mode" },
        { key: "date", label: "Return Date" },
        { key: "status", label: "Status" },
      ],
      data: returnsList,
    });
  };

  const filteredReturns = returnsList.filter(
    (r) =>
      r.returnNo.toLowerCase().includes(search.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.originalInvoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalRefundAmount = returnsList.reduce((sum, r) => sum + r.totalRefundAmount, 0);

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/purchases" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← পারচেজ চালানে ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🔄 সাপ্লায়ার পারচেজ রিটার্ন ও ডেবিট নোট (Purchase Returns)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            নষ্ট, মেয়াদোত্তীর্ণ বা ভুল পণ্য সাপ্লায়ারকে ফেরত পাঠানো এবং বকেয়া লেজার সমন্বয়।
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => setShowReturnModal(true)} className="btn-primary">
            ＋ নতুন পারচেজ রিটার্ন এন্ট্রি
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট ফেরত চালান সংখ্যা</span>
          <div className="stat-card-value">{returnsList.length}টি রিটার্ন</div>
          <div className="stat-card-sub">ডেবিট নোট ভাউচার ইস্যুকৃত</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">মোট সমন্বয়কৃত ফেরত টাকা</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(totalRefundAmount)}
          </div>
          <div className="stat-card-sub">সাপ্লায়ার বকেয়া থেকে বাদ বা ক্যাশ রিফান্ড</div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>সাপ্লায়ার রিটার্ন তালিকা ও ডেবিট নোট</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 রিটার্ন নং, সাপ্লায়ার বা পণ্য দিয়ে খুঁজুন..."
            style={{ padding: "6px 12px", border: "1px solid var(--border-color)", borderRadius: 6, fontSize: 13, width: 280 }}
          />
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>রিটার্ন নং (Debit Note)</th>
              <th>মূল চালান নং</th>
              <th>সাপ্লায়ারের নাম</th>
              <th>ফেরতকৃত পণ্য</th>
              <th>পরিমাণ ও কেনা দর</th>
              <th>মোট ফেরত মূল্য</th>
              <th>ফেরতের কারণ</th>
              <th>নিষ্পত্তি মোড</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ fontFamily: "monospace", color: "var(--primary-dark)" }}>{r.returnNo}</strong>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)" }}>{formatDate(r.date)}</span>
                </td>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.originalInvoiceNo}</span>
                </td>
                <td>
                  <strong>{r.supplierName}</strong>
                </td>
                <td>
                  <strong>{r.productName}</strong>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{r.sku}</span>
                </td>
                <td>
                  <strong>{r.quantity}টি</strong> × {formatCurrency(r.unitCost)}
                </td>
                <td>
                  <strong style={{ color: "var(--danger)", fontSize: 14 }}>{formatCurrency(r.totalRefundAmount)}</strong>
                </td>
                <td>
                  <span className="badge badge-neutral">
                    {r.reason === "DAMAGED_ITEMS"
                      ? "নষ্ট / ড্যামেজ"
                      : r.reason === "NEAR_EXPIRY"
                      ? "মেয়াদোত্তীর্ণ"
                      : "ভুল সরবরাহ"}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success">
                    {r.settlementType === "DUE_ADJUSTMENT" ? "বকেয়া থেকে কর্তন" : "নগদ রিফান্ড"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${r.status === "SETTLED" ? "badge-success" : "badge-warning"}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => setSelectedDebitNote(r)}
                    className="btn-secondary"
                    style={{ padding: "4px 8px", fontSize: 12 }}
                  >
                    📄 Debit Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: NEW RETURN */}
      {showReturnModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🔄 নতুন পারচেজ রিটার্ন এন্ট্রি</h2>
              <button onClick={() => setShowReturnModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReturn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সাপ্লায়ার নির্বাচন করুন *</label>
                <select
                  value={newReturn.supplierName}
                  onChange={(e) => setNewReturn({ ...newReturn, supplierName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                >
                  <option value="Meghna Group Ltd">Meghna Group Ltd</option>
                  <option value="ACI Consumer Care">ACI Consumer Care</option>
                  <option value="Square Toiletries Ltd">Square Toiletries Ltd</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মূল চালান নং (Original PO)</label>
                  <input
                    value={newReturn.originalInvoiceNo}
                    onChange={(e) => setNewReturn({ ...newReturn, originalInvoiceNo: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ফেরতের কারণ *</label>
                  <select
                    value={newReturn.reason}
                    onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value as any })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  >
                    <option value="DAMAGED_ITEMS">নষ্ট / ড্যামেজ পণ্য</option>
                    <option value="NEAR_EXPIRY">মেয়াদোত্তীর্ণ পণ্য</option>
                    <option value="WRONG_DELIVERY">ভুল পণ্য সরবরাহ</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ফেরতকৃত পণ্যের বিবরণ *</label>
                <input
                  required
                  value={newReturn.productName}
                  onChange={(e) => setNewReturn({ ...newReturn, productName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ফেরত সংখ্যা (Quantity) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newReturn.quantity}
                    onChange={(e) => setNewReturn({ ...newReturn, quantity: Number(e.target.value) || 1 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>কেনা দর (Unit Cost ৳)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newReturn.unitCost}
                    onChange={(e) => setNewReturn({ ...newReturn, unitCost: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ padding: 12, background: "var(--bg-subtle)", borderRadius: 6, display: "flex", justifyContent: "space-between" }}>
                <span>মোট কর্তনযোগ্য রিফান্ড:</span>
                <strong style={{ color: "var(--danger)", fontSize: 16 }}>{formatCurrency(newReturn.quantity * newReturn.unitCost)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowReturnModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>
                  ✓ রিটার্ন নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE DEBIT NOTE */}
      {selectedDebitNote && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 480, padding: 28, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>📄 ডেবিট নোট ভাউচার (Debit Note)</h3>
              <button onClick={() => setSelectedDebitNote(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ border: "2px solid #000", padding: 18, borderRadius: 6, fontFamily: "sans-serif" }}>
              <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 12 }}>
                <strong style={{ fontSize: 17, display: "block" }}>UNBEATABLE SUPER STORE</strong>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>পারচেজ রিটার্ন ডেবিট নোট</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>ডেবিট নোট নং:</span>
                <strong style={{ fontFamily: "monospace" }}>{selectedDebitNote.returnNo}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>সাপ্লায়ার:</span>
                <strong>{selectedDebitNote.supplierName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, borderBottom: "1px dashed #000", paddingBottom: 8 }}>
                <span>তারিখ:</span>
                <span>{formatDate(selectedDebitNote.date)}</span>
              </div>

              <div style={{ fontSize: 13, marginBottom: 12 }}>
                <div>ফেরতকৃত আইটেম: <b>{selectedDebitNote.productName}</b></div>
                <div>পরিমাণ: <b>{selectedDebitNote.quantity}টি</b> × দর: {formatCurrency(selectedDebitNote.unitCost)}</div>
                <div>কারণ: <span className="badge badge-neutral">{selectedDebitNote.reason}</span></div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, borderTop: "2px solid #000", paddingTop: 8, color: "#b91c1c" }}>
                <span>মোট ডেবিট / সমন্বয়:</span>
                <span>{formatCurrency(selectedDebitNote.totalRefundAmount)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button onClick={() => setSelectedDebitNote(null)} className="btn-secondary">
                বন্ধ করুন
              </button>
              <button onClick={() => window.print()} className="btn-primary">
                🖨️ প্রিন্ট ডেবিট নোট
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
