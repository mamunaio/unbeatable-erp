"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatters";

interface TransferRow {
  id: string;
  transferNo: string;
  fromLocation: string;
  toLocation: string;
  itemsCount: number;
  totalUnits: number;
  date: Date;
  status: "COMPLETED" | "IN_TRANSIT" | "PENDING";
  user: string;
}

const demoTransfers: TransferRow[] = [
  { id: "tr-1", transferNo: "TRF-2026-001", fromLocation: "Central Warehouse (Gazipur)", toLocation: "Dhaka Main Branch (Store)", itemsCount: 3, totalUnits: 150, date: new Date(), status: "COMPLETED", user: "Stock Keeper" },
  { id: "tr-2", transferNo: "TRF-2026-002", fromLocation: "Central Warehouse (Gazipur)", toLocation: "Uttara Branch Outlet", itemsCount: 5, totalUnits: 220, date: new Date(), status: "IN_TRANSIT", user: "Admin" },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferRow[]>(demoTransfers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromLoc, setFromLoc] = useState("Central Warehouse (Gazipur)");
  const [toLoc, setToLoc] = useState("Dhaka Main Branch");
  const [qty, setQty] = useState(25);
  const [productName, setProductName] = useState("Miniket Rice 25kg");

  const handleCreateTransfer = () => {
    const newTrf: TransferRow = {
      id: `tr-${Date.now()}`,
      transferNo: `TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
      fromLocation: fromLoc,
      toLocation: toLoc,
      itemsCount: 1,
      totalUnits: Number(qty) || 1,
      date: new Date(),
      status: "COMPLETED",
      user: "Admin",
    };
    setTransfers([newTrf, ...transfers]);
    setIsModalOpen(false);
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/inventory" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← ইনভেন্টরি লেজারে ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>📦 গুদাম ও ব্রাঞ্চ স্টক ট্রান্সফার (Stock Transfers)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>ওয়্যারহাউজ থেকে দোকানে এবং ব্রাঞ্চ-টু-ব্রাঞ্চ স্টক চালানের রেকর্ড।</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          ＋ নতুন স্টক ট্রান্সফার চালান তৈরি
        </button>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>চালান নম্বর (Transfer No)</th>
              <th>তারিখ ও সময়</th>
              <th>উৎস (From Location)</th>
              <th>গন্তব্য (To Location)</th>
              <th>আইটেম / মোট একক</th>
              <th>স্ট্যাটাস</th>
              <th>ইউজার</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t.id}>
                <td><strong style={{ fontFamily: "monospace", color: "var(--primary-dark)" }}>{t.transferNo}</strong></td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatDateTime(t.date)}</td>
                <td><span className="badge badge-neutral">{t.fromLocation}</span></td>
                <td><span className="badge badge-primary">{t.toLocation}</span></td>
                <td><strong>{t.itemsCount}টি আইটেম</strong> ({t.totalUnits} একক)</td>
                <td>
                  <span className={`badge ${t.status === "COMPLETED" ? "badge-success" : "badge-warning"}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 480, boxShadow: "var(--shadow-pos)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>নতুন স্টক স্থানান্তর চালান</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>কোথা থেকে পাঠানো হচ্ছে (Source Location) *</label>
                <select value={fromLoc} onChange={(e) => setFromLoc(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="Central Warehouse (Gazipur)">Central Warehouse (Gazipur)</option>
                  <option value="Dhaka Main Branch">Dhaka Main Branch (Store)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>কোথায় পাঠানো হচ্ছে (Destination Location) *</label>
                <select value={toLoc} onChange={(e) => setToLoc(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="Dhaka Main Branch (Store)">Dhaka Main Branch (Store)</option>
                  <option value="Uttara Branch Outlet">Uttara Branch Outlet</option>
                  <option value="Chittagong Branch">Chittagong Branch</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>স্থানান্তরযোগ্য প্রোডাক্ট *</label>
                <select value={productName} onChange={(e) => setProductName(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="Miniket Rice 25kg">Miniket Rice 25kg</option>
                  <option value="Soyabean Oil 5 Litre">Soyabean Oil 5 Litre</option>
                  <option value="Dano Milk Powder 1kg">Dano Milk Powder 1kg</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>স্থানান্তরের পরিমাণ (Quantity) *</label>
                <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={handleCreateTransfer} className="btn-primary">✓ চালান নিশ্চিত করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
