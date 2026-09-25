"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface StockMovementRow {
  id: string;
  productName: string;
  sku: string;
  type: "PURCHASE" | "SALE" | "ADJUSTMENT" | "DAMAGE";
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

const demoMovements: StockMovementRow[] = [
  { id: "sm-1", productName: "Miniket Rice 25kg", sku: "RICE-MIN-25", type: "PURCHASE", quantity: 50, reason: "Supplier Bill PO-101", date: "2026-09-25T10:30:00Z", user: "Admin" },
  { id: "sm-2", productName: "Miniket Rice 25kg", sku: "RICE-MIN-25", type: "SALE", quantity: -5, reason: "Invoice INV-94821", date: "2026-09-25T11:15:00Z", user: "Cashier 01" },
  { id: "sm-3", productName: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", type: "DAMAGE", quantity: -2, reason: "Water damage in shelf", date: "2026-09-25T12:00:00Z", user: "Stock Keeper" },
  { id: "sm-4", productName: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", type: "ADJUSTMENT", quantity: 5, reason: "Physical stock count mismatch", date: "2026-09-25T14:45:00Z", user: "Admin" },
];

export default function InventoryPage() {
  const [movements, setMovements] = useState<StockMovementRow[]>(demoMovements);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [productName, setProductName] = useState("Miniket Rice 25kg");
  const [adjustType, setAdjustType] = useState<"DAMAGE" | "WASTAGE" | "CORRECTION">("DAMAGE");
  const [qty, setQty] = useState("-2");
  const [reason, setReason] = useState("");

  const handleCreateAdjustment = () => {
    if (!reason.trim()) return;
    const numQty = Number(qty) || -1;
    const newMv: StockMovementRow = {
      id: `sm-${Date.now()}`,
      productName,
      sku: "RICE-MIN-25",
      type: adjustType === "DAMAGE" ? "DAMAGE" : "ADJUSTMENT",
      quantity: numQty,
      reason,
      date: new Date().toISOString(),
      user: "Admin",
    };
    setMovements([newMv, ...movements]);
    setIsAdjustModalOpen(false);
    setReason("");
  };

  const handleExport = () => {
    exportToCsv({
      filename: "Inventory_Stock_Movements_Ledger",
      headers: [
        { key: "date", label: "Date" },
        { key: "productName", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "type", label: "Movement Type" },
        { key: "quantity", label: "Quantity" },
        { key: "reason", label: "Reason & Reference" },
        { key: "user", label: "User" },
      ],
      data: movements,
    });
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>📑 ইনভেন্টরি লেজার ও স্টক ট্র্যাকিং</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>প্রতিটি পণ্যের ইনওয়ার্ড, আউটওয়ার্ড, ড্যামেজ ও সমন্বয়ের নিখুঁত হিস্ট্রি।</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
          <Link href="/inventory/damages" className="btn-secondary" style={{ color: "var(--danger)" }}>
            🗑️ Damages & Wastage
          </Link>
          <Link href="/inventory/transfers" className="btn-secondary">
            📦 Stock Transfers
          </Link>
          <Link href="/inventory/audit" className="btn-secondary">
            📋 Physical Count Audit
          </Link>
          <button onClick={() => setIsAdjustModalOpen(true)} className="btn-primary">
            ＋ স্টক সমন্বয় / ড্যামেজ
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-title">মোট বর্তমান স্টক ভ্যালু</span>
          <div className="stat-card-value">{formatCurrency(185400)}</div>
          <div className="stat-card-sub">ক্রয়মূল্য অনুযায়ী সংরক্ষিত মজুদ</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">মোট পণ্য সংখ্যা (Items)</span>
          <div className="stat-card-value">228 একক</div>
          <div className="stat-card-sub">সকল অ্যাক্টিভ ক্যাটাগরি মিলিয়ে</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">লো-স্টক সতর্কবার্তা</span>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>1টি আইটেম</div>
          <div className="stat-card-sub">পুনরায় অর্ডার করা আবশ্যক</div>
        </div>
      </div>

      {/* Stock Movements Table */}
      <div className="table-container">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>স্টক মুভমেন্ট হিস্ট্রি (Double-entry Stock Ledger)</h2>
          <span className="badge badge-neutral">সর্বশেষ ১০০টি এন্ট্রি</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>প্রোডাক্টের নাম / SKU</th>
              <th>মুভমেন্ট টাইপ</th>
              <th>পরিমাণ</th>
              <th>রেফারেন্স ও কারণ</th>
              <th>ইউজার</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatDateTime(m.date)}</td>
                <td>
                  <strong style={{ display: "block", color: "var(--text-main)" }}>{m.productName}</strong>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{m.sku}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      m.type === "PURCHASE"
                        ? "badge-success"
                        : m.type === "SALE"
                        ? "badge-primary"
                        : m.type === "DAMAGE"
                        ? "badge-danger"
                        : "badge-warning"
                    }`}
                  >
                    {m.type}
                  </span>
                </td>
                <td>
                  <strong style={{ color: m.quantity > 0 ? "var(--success)" : "var(--danger)", fontSize: 15 }}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </strong>
                </td>
                <td style={{ fontSize: 13 }}>{m.reason}</td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 480, boxShadow: "var(--shadow-pos)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>স্টক সমন্বয় বা ড্যামেজ এন্ট্রি</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              ভুল সংশোধন বা নষ্ট হওয়া পণ্যের কারণ ও পরিমাণ উল্লেখ করে স্টক আপডেট করুন।
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>প্রোডাক্ট সিলেক্ট করুন</label>
                <select value={productName} onChange={(e) => setProductName(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="Miniket Rice 25kg">Miniket Rice 25kg</option>
                  <option value="Soyabean Oil 5 Litre">Soyabean Oil 5 Litre</option>
                  <option value="LUX Beauty Soap 100g">LUX Beauty Soap 100g</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>এডজাস্টমেন্টের ধরন</label>
                <select value={adjustType} onChange={(e) => setAdjustType(e.target.value as any)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="DAMAGE">DAMAGE (নষ্ট / মেয়াদোত্তীর্ণ)</option>
                  <option value="WASTAGE">WASTAGE (ক্ষয়ক্ষতি)</option>
                  <option value="CORRECTION">CORRECTION (গণনায় ভুল সংশোধন)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>সমন্বয়ের পরিমাণ (+ বা -)</label>
                <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="যেমন: -2 বা 5" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>বাধ্যতামূলক কারণ (Reason) *</label>
                <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="সমন্বয়ের সুনির্দিষ্ট কারণ লিখুন" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsAdjustModalOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={handleCreateAdjustment} className="btn-primary">✓ এন্ট্রি নিশ্চিত করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
