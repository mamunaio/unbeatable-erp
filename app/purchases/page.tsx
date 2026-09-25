"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface PurchaseRow {
  id: string;
  invoiceNo: string;
  supplierChallanNo: string;
  supplierName: string;
  itemsCount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  date: Date;
  status: "RECEIVED" | "PARTIALLY_PAID" | "PENDING";
}

const initialPurchases: PurchaseRow[] = [
  { id: "po-1", invoiceNo: "PO-2026-001", supplierChallanNo: "MG-CHAL-8812", supplierName: "Meghna Group Ltd", itemsCount: 4, grandTotal: 45000, paidAmount: 45000, dueAmount: 0, date: new Date("2026-09-23"), status: "RECEIVED" },
  { id: "po-2", invoiceNo: "PO-2026-002", supplierChallanNo: "ACI-INV-9921", supplierName: "ACI Consumer Care", itemsCount: 6, grandTotal: 28500, paidAmount: 20000, dueAmount: 8500, date: new Date("2026-09-24"), status: "PARTIALLY_PAID" },
  { id: "po-3", invoiceNo: "PO-2026-003", supplierChallanNo: "SQ-CH-1109", supplierName: "Square Toiletries Ltd", itemsCount: 8, grandTotal: 62000, paidAmount: 62000, dueAmount: 0, date: new Date("2026-09-25"), status: "RECEIVED" },
  { id: "po-4", invoiceNo: "PO-2026-004", supplierChallanNo: "PRN-INV-4412", supplierName: "Pran-RFL Foods Ltd", itemsCount: 5, grandTotal: 34000, paidAmount: 25000, dueAmount: 9000, date: new Date("2026-09-25"), status: "PARTIALLY_PAID" },
];

export default function PurchasesPage() {
  const [purchases] = useState<PurchaseRow[]>(initialPurchases);
  const [search, setSearch] = useState("");

  const filtered = purchases.filter(
    (p) =>
      p.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierChallanNo.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalDueAmount = purchases.reduce((sum, p) => sum + p.dueAmount, 0);

  const handleExportCsv = () => {
    exportToCsv({
      filename: "Purchases_Inward_Report",
      headers: [
        { key: "invoiceNo", label: "PO Invoice No" },
        { key: "supplierChallanNo", label: "Supplier Challan" },
        { key: "supplierName", label: "Supplier Name" },
        { key: "itemsCount", label: "Items Count" },
        { key: "grandTotal", label: "Total Amount (BDT)" },
        { key: "paidAmount", label: "Paid Amount (BDT)" },
        { key: "dueAmount", label: "Due Amount (BDT)" },
        { key: "status", label: "Status" },
      ],
      data: filtered,
    });
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🛒 সাপ্লায়ার পারচেজ ও স্টক ইনওয়ার্ড (Purchases)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>সাপ্লায়ার চালান এন্ট্রি, মাল্টি-আইটেম ক্রয়, স্টক মজুদ বৃদ্ধি ও বকেয়া হিসাব।</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <Link href="/purchases/returns" className="btn-secondary" style={{ color: "var(--danger)", borderColor: "var(--border-color)" }}>
            🔄 সাপ্লায়ার রিটার্ন ও ডেবিট নোট
          </Link>
          <Link href="/purchases/new" className="btn-primary">
            ＋ নতুন পারচেজ চালান এন্ট্রি
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট পারচেজ চালান</span>
          <div className="stat-card-value">{purchases.length}টি চালান</div>
          <div className="stat-card-sub">স্টক ইনওয়ার্ড সম্পন্ন</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">মোট ক্রয় খরচ</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatCurrency(totalPurchasesAmount)}
          </div>
          <div className="stat-card-sub">সর্বমোট কেনাকাটা</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সাপ্লায়ার বকেয়া (Payable Due)</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(totalDueAmount)}
          </div>
          <div className="stat-card-sub">পরিশোধের অপেক্ষায় থাকা বাকি</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 20, padding: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 চালান নম্বর, সাপ্লায়ারের নাম দিয়ে খুঁজুন..."
          style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", outline: "none", fontSize: 13 }}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>চালান নম্বর (PO No)</th>
              <th>তারিখ</th>
              <th>সাপ্লায়ারের নাম</th>
              <th>আইটেম সংখ্যা</th>
              <th>মোট বিল</th>
              <th>পরিশোধিত</th>
              <th>বকেয়া (Due)</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong style={{ fontFamily: "monospace", color: "var(--primary-dark)" }}>{p.invoiceNo}</strong>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)" }}>Challan: {p.supplierChallanNo}</span>
                </td>
                <td>{formatDate(p.date)}</td>
                <td><strong>{p.supplierName}</strong></td>
                <td>{p.itemsCount}টি</td>
                <td><strong style={{ color: "var(--text-main)" }}>{formatCurrency(p.grandTotal)}</strong></td>
                <td><span style={{ color: "var(--success)" }}>{formatCurrency(p.paidAmount)}</span></td>
                <td>
                  <span style={{ color: p.dueAmount > 0 ? "var(--danger)" : "inherit", fontWeight: p.dueAmount > 0 ? 700 : 400 }}>
                    {formatCurrency(p.dueAmount)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.status === "RECEIVED" ? "badge-success" : "badge-warning"}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link href="/purchases/returns" className="btn-secondary" style={{ padding: "4px 8px", fontSize: 11 }}>
                    🔄 Return
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
