"use client";

import { use, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface SupplierLedgerEntry {
  id: string;
  date: string;
  type: "PURCHASE_BILL" | "PAYMENT_PAID" | "PURCHASE_RETURN_DEBIT";
  referenceNo: string;
  description: string;
  billedAmount: number; // Purchase bill added
  paidAmount: number; // Cash/Bank paid to supplier
  runningPayable: number;
}

interface SupplierProfile {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  dueBalance: number;
  totalPurchasesLifetime: number;
  totalPaidLifetime: number;
  partnershipDate: string;
}

const demoSuppliers: Record<string, SupplierProfile> = {
  "sp-1": {
    id: "sp-1",
    name: "Meghna Group of Industries Ltd",
    contactPerson: "Kamrul Hasan (Area Sales Manager)",
    phone: "01711000000",
    email: "kamrul@meghnagroup.biz",
    address: "Meghna House, Motijheel C/A, Dhaka",
    dueBalance: 0,
    totalPurchasesLifetime: 450000,
    totalPaidLifetime: 450000,
    partnershipDate: "2023-05-10",
  },
  "sp-2": {
    id: "sp-2",
    name: "ACI Consumer Brands Ltd",
    contactPerson: "Anisur Rahman (Territory Officer)",
    phone: "01811000000",
    email: "sales.dhaka@aci-bd.com",
    address: "ACI Centre, 245 Tejgaon I/A, Dhaka",
    dueBalance: 8500,
    totalPurchasesLifetime: 320000,
    totalPaidLifetime: 311500,
    partnershipDate: "2023-08-15",
  },
  "sp-3": {
    id: "sp-3",
    name: "Pran-RFL Foods Ltd",
    contactPerson: "Monirul Islam (Distributor Head)",
    phone: "01911000000",
    email: "supply@pranfoods.net",
    address: "PRAN-RFL Center, Middle Badda, Dhaka",
    dueBalance: 12400,
    totalPurchasesLifetime: 280000,
    totalPaidLifetime: 267600,
    partnershipDate: "2024-01-20",
  },
};

const demoSupplierLedger: SupplierLedgerEntry[] = [
  {
    id: "tx-1",
    date: "2026-09-25T11:00:00",
    type: "PURCHASE_BILL",
    referenceNo: "PO-2026-004",
    description: "প্রাণ জুস ও বিস্কুট চালান ইনওয়ার্ড",
    billedAmount: 34000,
    paidAmount: 25000,
    runningPayable: 12400,
  },
  {
    id: "tx-2",
    date: "2026-09-20T16:00:00",
    type: "PAYMENT_PAID",
    referenceNo: "EFT-DBBL-9912",
    description: "ব্যাংক EFT মারফত বকেয়া পরিশোধ",
    billedAmount: 0,
    paidAmount: 20000,
    runningPayable: 3400,
  },
  {
    id: "tx-3",
    date: "2026-09-15T14:30:00",
    type: "PURCHASE_RETURN_DEBIT",
    referenceNo: "PR-2026-001",
    description: "নষ্ট জুসের কার্টন ফেরত (ডেবিট নোট সমন্বয়)",
    billedAmount: 0,
    paidAmount: 3400,
    runningPayable: 23400,
  },
  {
    id: "tx-4",
    date: "2026-09-01T10:30:00",
    type: "PURCHASE_BILL",
    referenceNo: "PO-2026-001",
    description: "মাসিক স্টক কনসাইনমেন্ট ইনওয়ার্ড",
    billedAmount: 50000,
    paidAmount: 23200,
    runningPayable: 26800,
  },
];

export default function SupplierLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const supplierId = decodeURIComponent(resolvedParams.id);

  const supplier: SupplierProfile = demoSuppliers[supplierId] || {
    id: supplierId,
    name: "Meghna Group of Industries Ltd",
    contactPerson: "Kamrul Hasan",
    phone: "01711000000",
    address: "Motijheel, Dhaka",
    dueBalance: 8500,
    totalPurchasesLifetime: 320000,
    totalPaidLifetime: 311500,
    partnershipDate: "2023-05-10",
  };

  const [ledger] = useState<SupplierLedgerEntry[]>(demoSupplierLedger);
  const [isPayDueOpen, setIsPayDueOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(supplier.dueBalance);
  const [payMethod, setPayMethod] = useState("BANK");

  const handleExportCsv = () => {
    exportToCsv({
      filename: `Supplier_Statement_${supplier.name.replace(/\s+/g, "_")}`,
      headers: [
        { key: "date", label: "Date & Time" },
        { key: "referenceNo", label: "PO / Voucher No" },
        { key: "description", label: "Description" },
        { key: "billedAmount", label: "Billed / Payable (BDT)" },
        { key: "paidAmount", label: "Paid to Supplier (BDT)" },
        { key: "runningPayable", label: "Running Balance Due (BDT)" },
      ],
      data: ledger,
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 1020 }}>
      {/* Header */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Link href="/suppliers" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
            ← সকল সাপ্লায়ার তালিকায় ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🏭 সাপ্লায়ার প্রোফাইল ও খতিয়ান (Supplier Ledger)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            চালান বিল, ক্যাশ/ব্যাংক পরিশোধ এবং বকেয়া লেজার স্টেটমেন্ট।
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨️ প্রিন্ট খতিয়ান
          </button>
          <button onClick={() => setIsPayDueOpen(true)} className="btn-primary">
            💳 বাকি পরিশোধ করুন
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{supplier.name}</h2>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
              <div>👤 ফোকাল পারসন: <strong>{supplier.contactPerson}</strong></div>
              <div>📞 মোবাইল: <strong>{supplier.phone}</strong> {supplier.email ? `• ✉️ ${supplier.email}` : ""}</div>
              <div>📍 অফিস ঠিকানা: {supplier.address}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ background: "var(--bg-subtle)", padding: "12px 18px", borderRadius: 8, textAlign: "right" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>বর্তমান প্রদেয় বকেয়া (Payable):</span>
              <strong style={{ fontSize: 22, color: supplier.dueBalance > 0 ? "var(--danger)" : "var(--success)" }}>
                {formatCurrency(supplier.dueBalance)}
              </strong>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "12px 18px", borderRadius: 8, textAlign: "right" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>মোট ক্রয় লেনদেন:</span>
              <strong style={{ fontSize: 18, color: "var(--primary-dark)" }}>
                {formatCurrency(supplier.totalPurchasesLifetime)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট কেনাকাটা (Total Purchased)</span>
          <div className="stat-card-value">{formatCurrency(supplier.totalPurchasesLifetime)}</div>
          <div className="stat-card-sub">সাপ্লায়ারের থেকে প্রাপ্ত মোট চালান</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট পরিশোধিত (Total Paid)</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(supplier.totalPaidLifetime)}
          </div>
          <div className="stat-card-sub">ব্যাংক ও ক্যাশে পরিশোধিত বিল</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">পার্টনারশিপ শুরু</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatDate(supplier.partnershipDate)}
          </div>
          <div className="stat-card-sub">নিবন্ধিত অনুমোদিত ডিস্ট্রিবিউটর</div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="table-container" style={{ background: "#ffffff" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800 }}>সাপ্লায়ার হিসাবের খতিয়ান (Supplier Account Statement)</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>সকল পারচেজ চালান, ব্যাংক পেমেন্ট ও ডেবিট নোট সমন্বয়।</span>
          </div>
          <span className="badge badge-neutral">Audited Statement</span>
        </div>

        <table className="erp-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>চালান / ভাউচার নং</th>
              <th>লেনদেনের বিবরণ</th>
              <th style={{ textAlign: "right" }}>চালান বিল (পাওনা ৳)</th>
              <th style={{ textAlign: "right" }}>পরিশোধিত টাকা (৳)</th>
              <th style={{ textAlign: "right" }}>চলমান বকেয়া (Payable Due)</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDateTime(tx.date)}</td>
                <td>
                  <strong style={{ fontFamily: "monospace", color: "var(--primary-dark)" }}>{tx.referenceNo}</strong>
                </td>
                <td>
                  <strong>{tx.description}</strong>
                </td>
                <td style={{ textAlign: "right", color: tx.billedAmount > 0 ? "var(--danger)" : "var(--text-muted)" }}>
                  {tx.billedAmount > 0 ? formatCurrency(tx.billedAmount) : "--"}
                </td>
                <td style={{ textAlign: "right", color: "var(--success)", fontWeight: 700 }}>
                  {tx.paidAmount > 0 ? `+ ${formatCurrency(tx.paidAmount)}` : "--"}
                </td>
                <td style={{ textAlign: "right", fontWeight: 800, color: tx.runningPayable > 0 ? "var(--danger)" : "var(--success)" }}>
                  {formatCurrency(tx.runningPayable)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: PAY DUE */}
      {isPayDueOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>💳 সাপ্লায়ার বাকি পরিশোধ (Pay Due)</h2>
              <button onClick={() => setIsPayDueOpen(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <div>সাপ্লায়ার: <strong>{supplier.name}</strong></div>
              <div>বর্তমান প্রদেয় বকেয়া: <strong style={{ color: "var(--danger)" }}>{formatCurrency(supplier.dueBalance)}</strong></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পরিশোধের পরিমাণ (BDT) *</label>
                <input
                  type="number"
                  min="1"
                  max={supplier.dueBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700, fontSize: 16 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পরিশোধের মাধ্যম *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                >
                  <option value="BANK">Bank Account (DBBL / BRAC Bank EFT)</option>
                  <option value="CASH">Cash Counter (ক্যাশ)</option>
                  <option value="BKASH">bKash Merchant</option>
                  <option value="CHEQUE">Bank Cheque (চেক)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button onClick={() => setIsPayDueOpen(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button
                  onClick={() => {
                    alert(`✓ ${formatCurrency(payAmount)} সাপ্লায়ারকে সফলভাবে পরিশোধ করা হয়েছে!`);
                    setIsPayDueOpen(false);
                  }}
                  className="btn-primary"
                >
                  ✓ পরিশোধ নিশ্চিত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
