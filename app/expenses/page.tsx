"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const expenses = [
    { id: "ex-1", title: "দোকানের বিদ্যুৎ বিল (DESCO)", category: "Utility", amount: 4500, date: new Date(), paidThrough: "BKASH" },
    { id: "ex-2", title: "দোকানের কর্মচারীদের চা-নাস্তা খরচ", category: "Entertainment", amount: 350, date: new Date(), paidThrough: "CASH" },
    { id: "ex-3", title: "দোকানের মাসিকের দোকান ভাড়া", category: "Rent", amount: 25000, date: new Date(), paidThrough: "BANK" },
  ];

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>দৈনিক ক্যাশবুক ও খরচ (Expense Tracker)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের প্রাত্যহিক সকল প্রকার পরিচালন ব্যয় ও ক্যাশ হিসাব।</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          ＋ নতুন খরচ এন্ট্রি করুন
        </button>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>খরচের বিবরণ</th>
              <th>ক্যাটাগরি</th>
              <th>টাকা পরিশোধের মাধ্যম</th>
              <th>মোট খরচের অংক</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{formatDate(e.date)}</td>
                <td><strong>{e.title}</strong></td>
                <td><span className="badge badge-neutral">{e.category}</span></td>
                <td><span className="badge badge-primary">{e.paidThrough}</span></td>
                <td><strong style={{ color: "var(--danger)" }}>{formatCurrency(e.amount)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 440 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>নতুন খরচের ভাউচার এন্ট্রি</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>খরচের বিবরণ *</label>
                <input placeholder="যেমন: জেনারেটর বিল বা পলিথিন ক্রয়" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ক্যাটাগরি</label>
                <select style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option>Utility (বিদ্যুৎ / গ্যাস / পানি)</option>
                  <option>Rent (দোকান ভাড়া)</option>
                  <option>Entertainment (আপ্যায়ন)</option>
                  <option>Salary (কর্মচারী বেতন)</option>
                  <option>Maintenance (মেরামত)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>খরচের পরিমাণ (৳) *</label>
                <input type="number" placeholder="0.00" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-primary">✓ এন্ট্রি নিশ্চিত করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
