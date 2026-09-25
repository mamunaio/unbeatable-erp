"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  type: "WALK_IN" | "RETAIL" | "WHOLESALE" | "REGULAR";
  dueBalance: number;
  creditLimit: number;
  points: number;
}

const initialCustomers: CustomerRow[] = [
  { id: "c1", name: "Walk-in Customer", phone: "01700000000", type: "WALK_IN", dueBalance: 0, creditLimit: 0, points: 0 },
  { id: "c2", name: "Rahim Chowdhury", phone: "01711223344", type: "REGULAR", dueBalance: 1200, creditLimit: 5000, points: 85 },
  { id: "c3", name: "Kalam Store Wholesale", phone: "01822334455", type: "WHOLESALE", dueBalance: 15400, creditLimit: 30000, points: 340 },
  { id: "c4", name: "Jamil Hossain", phone: "01933445566", type: "RETAIL", dueBalance: 450, creditLimit: 2000, points: 20 },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(initialCustomers);
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [selectedCustForPayment, setSelectedCustForPayment] = useState<CustomerRow | null>(null);
  const [selectedCustForLedger, setSelectedCustForLedger] = useState<CustomerRow | null>(null);

  // Form states
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"CASH" | "BKASH" | "NAGAD" | "BANK">("CASH");
  const [payNote, setPayNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // New Cust form
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newType, setNewType] = useState<"RETAIL" | "WHOLESALE" | "REGULAR">("RETAIL");
  const [newLimit, setNewLimit] = useState("5000");

  const openPaymentModal = (cust: CustomerRow) => {
    setSelectedCustForPayment(cust);
    setPayAmount(cust.dueBalance);
    setPayNote("");
  };

  const handleDuePaymentSubmit = async () => {
    if (!selectedCustForPayment || payAmount <= 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/customers/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustForPayment.id,
          amount: payAmount,
          method: payMethod,
          notes: payNote,
        }),
      });

      // Update state locally
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustForPayment.id
            ? { ...c, dueBalance: Math.max(0, c.dueBalance - payAmount) }
            : c
        )
      );
      setSelectedCustForPayment(null);
    } catch (e) {
      console.error(e);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustForPayment.id
            ? { ...c, dueBalance: Math.max(0, c.dueBalance - payAmount) }
            : c
        )
      );
      setSelectedCustForPayment(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const newCust: CustomerRow = {
      id: `c-${Date.now()}`,
      name: newName,
      phone: newPhone,
      type: newType,
      dueBalance: 0,
      creditLimit: Number(newLimit) || 0,
      points: 0,
    };
    setCustomers([newCust, ...customers]);
    setIsNewCustModalOpen(false);
    setNewName("");
    setNewPhone("");
  };

  const handleExport = () => {
    exportToCsv({
      filename: "Customer_Due_Ledger",
      headers: [
        { key: "name", label: "Customer Name" },
        { key: "phone", label: "Mobile" },
        { key: "type", label: "Type" },
        { key: "dueBalance", label: "Due Balance (BDT)" },
        { key: "creditLimit", label: "Credit Limit (BDT)" },
        { key: "points", label: "Loyalty Points" },
      ],
      data: customers,
    });
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>👥 কাস্টমার ডাটাবেস ও বাকি খাতা (Customers CRM)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>কাস্টমার প্রোফাইল, বকেয়া আদায় (Due Collection) ও লেজার হিস্ট্রি।</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
          <button onClick={() => setIsNewCustModalOpen(true)} className="btn-primary">
            ＋ নতুন কাস্টমার যোগ করুন
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-title">মোট কাস্টমার সংখ্যা</span>
          <div className="stat-card-value">{customers.length} জন</div>
          <div className="stat-card-sub">রেজিস্টার্ড কাস্টমার প্রোফাইল</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট প্রদেয় বাকি (Total Due)</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(customers.reduce((acc, c) => acc + c.dueBalance, 0))}
          </div>
          <div className="stat-card-sub">বাজার থেকে আদায়যোগ্য টাকা</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">বকেয়াযুক্ত কাস্টমার</span>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>
            {customers.filter((c) => c.dueBalance > 0).length} জন
          </div>
          <div className="stat-card-sub">যাদের কাছে টাকা পাওনা রয়েছে</div>
        </div>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>কাস্টমারের নাম</th>
              <th>মোবাইল নম্বর</th>
              <th>ধরন (Type)</th>
              <th>বাকি ব্যালেন্স (Due)</th>
              <th>ক্রেডিট লিমিট</th>
              <th>লয়ালটি পয়েন্ট</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>{c.phone}</td>
                <td><span className="badge badge-neutral">{c.type}</span></td>
                <td>
                  <strong style={{ color: c.dueBalance > 0 ? "var(--danger)" : "inherit" }}>
                    {formatCurrency(c.dueBalance)}
                  </strong>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{formatCurrency(c.creditLimit)}</td>
                <td><span className="badge badge-primary">{c.points} pts</span></td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <Link
                      href={`/customers/${c.id}`}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12, color: "var(--primary-dark)" }}
                    >
                      👤 Profile
                    </Link>
                    {c.dueBalance > 0 && (
                      <button
                        onClick={() => openPaymentModal(c)}
                        className="btn-primary"
                        style={{ padding: "4px 10px", fontSize: 12, background: "var(--success)" }}
                      >
                        💵 বাকি আদায়
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCustForLedger(c)}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      📜 Ledger
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECEIVE DUE PAYMENT MODAL */}
      {selectedCustForPayment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, padding: 24, boxShadow: "var(--shadow-pos)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>💵 কাস্টমার বকেয়া টাকা আদায়</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>কাস্টমার: <b>{selectedCustForPayment.name}</b> ({selectedCustForPayment.phone})</p>

            <div style={{ background: "var(--danger-bg)", padding: "12px 16px", borderRadius: 8, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--danger-text)", fontWeight: 600 }}>বর্তমান মোট বাকি:</span>
              <strong style={{ color: "var(--danger-text)", fontSize: 16 }}>{formatCurrency(selectedCustForPayment.dueBalance)}</strong>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>আদায়কৃত টাকার পরিমাণ (৳) *</label>
              <input
                type="number"
                min="1"
                max={selectedCustForPayment.dueBalance}
                value={payAmount || ""}
                onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "2px solid #cbd5e1", fontSize: 16, fontWeight: 700 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>টাকা গ্রহণের মাধ্যম</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["CASH", "BKASH", "NAGAD", "BANK"] as const).map((m) => (
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
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মন্তব্য বা রসিদ রেফারেন্স</label>
              <input
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                placeholder="যেমন: ক্যাশ কাউন্টারে জমা / বিকাশ ট্রানজেকশন আইডি"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedCustForPayment(null)} className="btn-secondary">বাতিল</button>
              <button
                disabled={submitting}
                onClick={handleDuePaymentSubmit}
                className="btn-primary"
                style={{ background: "var(--success)", borderColor: "var(--success)" }}
              >
                {submitting ? "প্রসেস হচ্ছে..." : "✓ জমা গ্রহণ নিশ্চিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER LEDGER MODAL */}
      {selectedCustForLedger && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, padding: 24, boxShadow: "var(--shadow-pos)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>📜 কাস্টমার লেজার স্টেটমেন্ট (Customer Ledger)</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedCustForLedger.name} • {selectedCustForLedger.phone}</span>
              </div>
              <button onClick={() => setSelectedCustForLedger(null)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <div>ক্রেডিট লিমিট: <strong>{formatCurrency(selectedCustForLedger.creditLimit)}</strong></div>
              <div>বর্তমান মোট বাকি: <strong style={{ color: "var(--danger)" }}>{formatCurrency(selectedCustForLedger.dueBalance)}</strong></div>
              <div>পয়েন্ট: <strong>{selectedCustForLedger.points} pts</strong></div>
            </div>

            <div style={{ maxHeight: 240, overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: 8, marginBottom: 16 }}>
              <table className="erp-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>তারিখ</th>
                    <th>বিবরণ / ইনভয়েস</th>
                    <th>ডেবিট (বাকি বিল)</th>
                    <th>ক্রেডিট (জমা)</th>
                    <th>ব্যালেন্স</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatDateTime(new Date(Date.now() - 86400000 * 5))}</td>
                    <td>Invoice #INV-982101</td>
                    <td>{formatCurrency(2400)}</td>
                    <td>-</td>
                    <td>{formatCurrency(2400)}</td>
                  </tr>
                  <tr>
                    <td>{formatDateTime(new Date(Date.now() - 86400000 * 2))}</td>
                    <td>Cash Payment Recv</td>
                    <td>-</td>
                    <td style={{ color: "var(--success)" }}>{formatCurrency(1200)}</td>
                    <td><strong>{formatCurrency(1200)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => window.print()} className="btn-secondary">🖨️ লেজার প্রিন্ট</button>
              <button onClick={() => setSelectedCustForLedger(null)} className="btn-primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CUSTOMER MODAL */}
      {isNewCustModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 440 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>নতুন কাস্টমার প্রোফাইল</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>কাস্টমারের পুরো নাম *</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="যেমন: মো: হাবিবুর রহমান" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>মোবাইল নম্বর *</label>
                <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="017XXXXXXXX" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>কাস্টমার টাইপ</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value as any)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}>
                  <option value="RETAIL">Retail (খুচরা)</option>
                  <option value="WHOLESALE">Wholesale (পাইকারি)</option>
                  <option value="REGULAR">Regular (নিয়মিত)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>সর্বোচ্চ বাকি লিমিট (Credit Limit ৳)</label>
                <input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsNewCustModalOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={handleCreateCustomer} className="btn-primary">✓ কাস্টমার সংরক্ষণ করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
