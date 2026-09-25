"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface SupplierRow {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  dueBalance: number;
}

const initialSuppliers: SupplierRow[] = [
  { id: "sp-1", name: "Meghna Group of Industries", contactName: "Kamrul Hasan", phone: "01711000000", dueBalance: 0 },
  { id: "sp-2", name: "ACI Consumer Brands", contactName: "Anisur Rahman", phone: "01811000000", dueBalance: 8500 },
  { id: "sp-3", name: "Pran Foods Ltd", contactName: "Monirul Islam", phone: "01911000000", dueBalance: 12400 },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierRow[]>(initialSuppliers);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [selectedSupplierForPay, setSelectedSupplierForPay] = useState<SupplierRow | null>(null);
  const [selectedSupplierForLedger, setSelectedSupplierForLedger] = useState<SupplierRow | null>(null);

  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"CASH" | "BKASH" | "NAGAD" | "BANK">("BANK");
  const [payNote, setPayNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // New Supplier state
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const openPayModal = (s: SupplierRow) => {
    setSelectedSupplierForPay(s);
    setPayAmount(s.dueBalance);
    setPayNote("");
  };

  const handleSupplierPayment = async () => {
    if (!selectedSupplierForPay || payAmount <= 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/suppliers/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: selectedSupplierForPay.id,
          amount: payAmount,
          method: payMethod,
          notes: payNote,
        }),
      });

      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedSupplierForPay.id
            ? { ...s, dueBalance: Math.max(0, s.dueBalance - payAmount) }
            : s
        )
      );
      setSelectedSupplierForPay(null);
    } catch (e) {
      console.error(e);
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedSupplierForPay.id
            ? { ...s, dueBalance: Math.max(0, s.dueBalance - payAmount) }
            : s
        )
      );
      setSelectedSupplierForPay(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSupplier = () => {
    if (!newName.trim()) return;
    const newSupp: SupplierRow = {
      id: `sp-${Date.now()}`,
      name: newName,
      contactName: newContact || "—",
      phone: newPhone || "—",
      dueBalance: 0,
    };
    setSuppliers([newSupp, ...suppliers]);
    setIsNewSupplierOpen(false);
    setNewName("");
    setNewContact("");
    setNewPhone("");
  };

  const handleExport = () => {
    exportToCsv({
      filename: "Supplier_Due_Payable_Ledger",
      headers: [
        { key: "name", label: "Supplier / Company" },
        { key: "contactName", label: "Contact Person" },
        { key: "phone", label: "Phone" },
        { key: "dueBalance", label: "Payable Due (BDT)" },
      ],
      data: suppliers,
    });
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🚚 সাপ্লায়ার ও সরবরাহকারী ডিরেক্টরি</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>পণ্য সরবরাহকারী প্রতিষ্ঠান, বিল পরিশোধ ও পাওনা হিসাব।</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
          <button onClick={() => setIsNewSupplierOpen(true)} className="btn-primary">
            ＋ নতুন সাপ্লায়ার যোগ করুন
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>কোম্পানি / সাপ্লায়ারের নাম</th>
              <th>দায়িত্বপ্রাপ্ত ব্যক্তি</th>
              <th>মোবাইল নম্বর</th>
              <th>মোট প্রদেয় বকেয়া (Payable Due)</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.contactName}</td>
                <td>{s.phone}</td>
                <td>
                  <strong style={{ color: s.dueBalance > 0 ? "var(--danger)" : "inherit" }}>
                    {formatCurrency(s.dueBalance)}
                  </strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <Link
                      href={`/suppliers/${s.id}`}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12, color: "var(--primary-dark)", textDecoration: "none" }}
                    >
                      🏢 Profile
                    </Link>
                    {s.dueBalance > 0 && (
                      <button
                        onClick={() => openPayModal(s)}
                        className="btn-primary"
                        style={{ padding: "4px 10px", fontSize: 12, background: "var(--danger)" }}
                      >
                        💵 বিল পরিশোধ
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSupplierForLedger(s)}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      📜 Quick Ledger
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUPPLIER PAYMENT MODAL */}
      {selectedSupplierForPay && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, padding: 24, boxShadow: "var(--shadow-pos)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>💵 সাপ্লায়ার বিল পরিশোধ (Supplier Payment)</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>কোম্পানি: <b>{selectedSupplierForPay.name}</b></p>

            <div style={{ background: "var(--danger-bg)", padding: "12px 16px", borderRadius: 8, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--danger-text)", fontWeight: 600 }}>মোট প্রদেয় বকেয়া:</span>
              <strong style={{ color: "var(--danger-text)", fontSize: 16 }}>{formatCurrency(selectedSupplierForPay.dueBalance)}</strong>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পরিশোধের পরিমাণ (৳) *</label>
              <input
                type="number"
                min="1"
                max={selectedSupplierForPay.dueBalance}
                value={payAmount || ""}
                onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "2px solid #cbd5e1", fontSize: 16, fontWeight: 700 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পরিশোধের মাধ্যম</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["BANK", "CASH", "BKASH", "NAGAD"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMethod(m)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      border: payMethod === m ? "2px solid var(--primary)" : "1px solid #cbd5e1",
                      background: payMethod === m ? "var(--primary-light)" : "#fff",
                      color: payMethod === m ? "var(--primary-dark)" : "#475569",
                      cursor: "pointer",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>চেক নম্বর / ভাউচার রেফারেন্স</label>
              <input
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                placeholder="যেমন: ব্যাংক চেক #৯৮২১৪ বা চালান রসিদ"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedSupplierForPay(null)} className="btn-secondary">বাতিল</button>
              <button
                disabled={submitting}
                onClick={handleSupplierPayment}
                className="btn-primary"
              >
                {submitting ? "প্রসেস হচ্ছে..." : "✓ পরিশোধ নিশ্চিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLIER LEDGER MODAL */}
      {selectedSupplierForLedger && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, padding: 24, boxShadow: "var(--shadow-pos)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>📜 সাপ্লায়ার লেজার হিস্ট্রি (Supplier Ledger)</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedSupplierForLedger.name} • {selectedSupplierForLedger.contactName}</span>
              </div>
              <button onClick={() => setSelectedSupplierForLedger(null)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <div>মোবাইল: <strong>{selectedSupplierForLedger.phone}</strong></div>
              <div>মোট প্রদেয় বকেয়া: <strong style={{ color: "var(--danger)" }}>{formatCurrency(selectedSupplierForLedger.dueBalance)}</strong></div>
            </div>

            <div style={{ maxHeight: 240, overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: 8, marginBottom: 16 }}>
              <table className="erp-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>তারিখ</th>
                    <th>চালান / ভাউচার</th>
                    <th>বিল (ক্রয়)</th>
                    <th>পরিশোধ (জমা)</th>
                    <th>ব্যালেন্স</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatDateTime(new Date(Date.now() - 86400000 * 6))}</td>
                    <td>PO #PO-2026-002</td>
                    <td>{formatCurrency(28500)}</td>
                    <td>{formatCurrency(20000)}</td>
                    <td><strong style={{ color: "var(--danger)" }}>{formatCurrency(8500)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => window.print()} className="btn-secondary">🖨️ লেজার প্রিন্ট</button>
              <button onClick={() => setSelectedSupplierForLedger(null)} className="btn-primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SUPPLIER MODAL */}
      {isNewSupplierOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 440 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>নতুন সাপ্লায়ার প্রোফাইল</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>কোম্পানির নাম *</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="যেমন: Akij Food & Beverage" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>যোগাযোগকারীর নাম</label>
                <input value={newContact} onChange={(e) => setNewContact(e.target.value)} placeholder="যেমন: মো: তারিকুল ইসলাম" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>মোবাইল নম্বর</label>
                <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="017XXXXXXXX" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsNewSupplierOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={handleCreateSupplier} className="btn-primary">✓ সেভ করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
