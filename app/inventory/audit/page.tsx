"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

interface AuditItem {
  id: string;
  name: string;
  sku: string;
  systemStock: number;
  countedStock: number;
  costPrice: number;
}

const initialAuditItems: AuditItem[] = [
  { id: "1", name: "Miniket Rice 25kg", sku: "RICE-MIN-25", systemStock: 45, countedStock: 45, costPrice: 1650 },
  { id: "2", name: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", systemStock: 30, countedStock: 28, costPrice: 760 },
  { id: "3", name: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", systemStock: 60, countedStock: 62, costPrice: 78 },
  { id: "4", name: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", systemStock: 15, countedStock: 15, costPrice: 780 },
  { id: "5", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", systemStock: 8, countedStock: 7, costPrice: 52 },
];

export default function StockAuditPage() {
  const [items, setItems] = useState<AuditItem[]>(initialAuditItems);
  const [approverName, setApproverName] = useState("Admin User (Manager)");
  const [auditReason, setAuditReason] = useState("মাসিক নিয়মিত ফিজিক্যাল স্টক অডিট ও গণনাকরণ");
  const [isDone, setIsDone] = useState(false);

  const handleCountChange = (id: string, count: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, countedStock: Math.max(0, count) } : it))
    );
  };

  // Calculate total variance impact
  let totalDiscrepancyValue = 0;
  let mismatchCount = 0;

  items.forEach((it) => {
    const diff = it.countedStock - it.systemStock;
    if (diff !== 0) {
      mismatchCount++;
      totalDiscrepancyValue += diff * it.costPrice;
    }
  });

  const handleReconcile = () => {
    setIsDone(true);
    setTimeout(() => {
      // Reset system stock to match counted stock
      setItems((prev) =>
        prev.map((it) => ({ ...it, systemStock: it.countedStock }))
      );
      setIsDone(false);
      alert("✓ ফিজিক্যাল স্টক অডিট সফলভাবে অনুমোদিত ও সমন্বিত হয়েছে!");
    }, 600);
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/inventory" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← ইনভেন্টরি লেজারে ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>📋 ফিজিক্যাল স্টক অডিট ও মিলকরণ (Stock Audit)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের বাস্তব গণনা ইনপুট দিন এবং অমিলগুলো স্বয়ংক্রিয়ভাবে সমন্বয় করুন।</p>
        </div>
        <button onClick={handleReconcile} disabled={isDone} className="btn-primary" style={{ padding: "10px 20px" }}>
          {isDone ? "সমন্বয় হচ্ছে..." : "✓ অডিট অনুমোদন ও স্টক সমন্বয় (Reconcile)"}
        </button>
      </div>

      {/* Audit Stats Banner */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <span className="stat-card-title">অডিটকৃত মোট পণ্য</span>
          <div className="stat-card-value">{items.length}টি</div>
          <div className="stat-card-sub">দোকানের শেলফ অডিট শিট</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">অমিলযুক্ত আইটেম (Mismatch Count)</span>
          <div className="stat-card-value" style={{ color: mismatchCount > 0 ? "var(--danger)" : "var(--success)" }}>
            {mismatchCount}টি আইটেম
          </div>
          <div className="stat-card-sub">সিস্টেম বনাম বাস্তব গণনা</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">মোট আর্থিক প্রভাব (Variance Value)</span>
          <div className="stat-card-value" style={{ color: totalDiscrepancyValue < 0 ? "var(--danger)" : "var(--primary)" }}>
            {totalDiscrepancyValue > 0 ? `+${formatCurrency(totalDiscrepancyValue)}` : formatCurrency(totalDiscrepancyValue)}
          </div>
          <div className="stat-card-sub">স্টক ঘাটতি / অতিরিক্ত মান</div>
        </div>
      </div>

      {/* Approver & Reason */}
      <div className="card" style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>অনুমোদনকারী কর্মকর্তা (Approver) *</label>
          <input
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>অডিটের সুনির্দিষ্ট কারণ (Audit Purpose) *</label>
          <input
            value={auditReason}
            onChange={(e) => setAuditReason(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
          />
        </div>
      </div>

      {/* Count Sheet Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>প্রোডাক্টের নাম / SKU</th>
              <th>ক্রয়মূল্য</th>
              <th>সিস্টেম রেকর্ডকৃত স্টক</th>
              <th>বাস্তব গণনা (Counted Physical Stock)</th>
              <th>পার্থক্য (Variance)</th>
              <th>আর্থিক প্রভাব</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const variance = it.countedStock - it.systemStock;
              const valDiff = variance * it.costPrice;
              return (
                <tr key={it.id}>
                  <td>
                    <strong style={{ display: "block" }}>{it.name}</strong>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{it.sku}</span>
                  </td>
                  <td>{formatCurrency(it.costPrice)}</td>
                  <td><strong style={{ fontSize: 15 }}>{it.systemStock}</strong> একক</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={it.countedStock}
                      onChange={(e) => handleCountChange(it.id, Number(e.target.value) || 0)}
                      style={{
                        width: 80,
                        padding: "6px 10px",
                        fontSize: 15,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: variance !== 0 ? "2px solid var(--warning)" : "1px solid #cbd5e1",
                        textAlign: "center",
                      }}
                    />
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: variance === 0 ? "var(--success)" : variance < 0 ? "var(--danger)" : "var(--primary)",
                      }}
                    >
                      {variance > 0 ? `+${variance}` : variance}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: valDiff < 0 ? "var(--danger)" : valDiff > 0 ? "var(--success)" : "inherit" }}>
                      {valDiff > 0 ? `+${formatCurrency(valDiff)}` : formatCurrency(valDiff)}
                    </strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
