"use client";

import { use, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface CustomerLedgerEntry {
  id: string;
  date: string;
  type: "SALE_INVOICE" | "PAYMENT_COLLECTED" | "SALES_RETURN_REFUND";
  referenceNo: string;
  description: string;
  debit: number; // Bill amount added
  credit: number; // Payment received
  runningBalance: number;
}

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  type: "WHOLESALE" | "RETAIL" | "REGULAR";
  creditLimit: number;
  dueBalance: number;
  loyaltyPoints: number;
  totalPurchasedLifetime: number;
  totalPaidLifetime: number;
  joiningDate: string;
}

const demoCustomers: Record<string, CustomerProfile> = {
  c2: {
    id: "c2",
    name: "Rahim Chowdhury",
    phone: "01711223344",
    email: "rahim.chowdhury@example.com",
    address: "House 14, Road 7, Dhanmondi, Dhaka",
    type: "REGULAR",
    creditLimit: 5000,
    dueBalance: 1200,
    loyaltyPoints: 85,
    totalPurchasedLifetime: 48500,
    totalPaidLifetime: 47300,
    joiningDate: "2024-03-12",
  },
  c3: {
    id: "c3",
    name: "Kalam Store Wholesale",
    phone: "01822334455",
    email: "kalam.traders@example.com",
    address: "Shop 12, Chawkbazar, Old Dhaka",
    type: "WHOLESALE",
    creditLimit: 30000,
    dueBalance: 15400,
    loyaltyPoints: 340,
    totalPurchasedLifetime: 185000,
    totalPaidLifetime: 169600,
    joiningDate: "2023-11-20",
  },
  c4: {
    id: "c4",
    name: "Jamil Hossain",
    phone: "01933445566",
    address: "Sector 3, Uttara, Dhaka",
    type: "RETAIL",
    creditLimit: 2000,
    dueBalance: 450,
    loyaltyPoints: 20,
    totalPurchasedLifetime: 12400,
    totalPaidLifetime: 11950,
    joiningDate: "2025-01-10",
  },
};

const demoLedgerEntries: CustomerLedgerEntry[] = [
  {
    id: "tx-1",
    date: "2026-09-25T14:30:00",
    type: "SALE_INVOICE",
    referenceNo: "INV-8921-1005",
    description: "চাল ও ডানো দুধ ক্রয় (বাকিতে সেলস)",
    debit: 2700,
    credit: 1500,
    runningBalance: 1200,
  },
  {
    id: "tx-2",
    date: "2026-09-20T17:15:00",
    type: "PAYMENT_COLLECTED",
    referenceNo: "PAY-BK-8812",
    description: "বিকাশ মারফত পূর্বের বকেয়া পরিশোধ",
    debit: 0,
    credit: 3000,
    runningBalance: 0,
  },
  {
    id: "tx-3",
    date: "2026-09-15T11:00:00",
    type: "SALE_INVOICE",
    referenceNo: "INV-8921-0945",
    description: "সয়াবিন তেল ও মুদি সামগ্রী ক্রয়",
    debit: 4500,
    credit: 1500,
    runningBalance: 3000,
  },
  {
    id: "tx-4",
    date: "2026-09-01T10:00:00",
    type: "SALE_INVOICE",
    referenceNo: "INV-8921-0811",
    description: "প্রারম্ভিক ব্যালেন্স ও মাসিক মুদি ক্রয়",
    debit: 6500,
    credit: 6500,
    runningBalance: 0,
  },
];

export default function CustomerLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = decodeURIComponent(resolvedParams.id);

  const customer: CustomerProfile = demoCustomers[customerId] || {
    id: customerId,
    name: "Rahim Chowdhury",
    phone: "01711223344",
    address: "Dhanmondi, Dhaka",
    type: "REGULAR",
    creditLimit: 5000,
    dueBalance: 1200,
    loyaltyPoints: 85,
    totalPurchasedLifetime: 48500,
    totalPaidLifetime: 47300,
    joiningDate: "2024-03-12",
  };

  const [ledger] = useState<CustomerLedgerEntry[]>(demoLedgerEntries);
  const [isCollectDueOpen, setIsCollectDueOpen] = useState(false);
  const [collectionAmount, setCollectionAmount] = useState(customer.dueBalance);
  const [collectionMethod, setCollectionMethod] = useState("CASH");

  const handleExportCsv = () => {
    exportToCsv({
      filename: `Customer_Statement_${customer.name.replace(/\s+/g, "_")}`,
      headers: [
        { key: "date", label: "Date & Time" },
        { key: "referenceNo", label: "Invoice / Voucher No" },
        { key: "description", label: "Transaction Description" },
        { key: "debit", label: "Billed / Debit (BDT)" },
        { key: "credit", label: "Paid / Credit (BDT)" },
        { key: "runningBalance", label: "Balance Due (BDT)" },
      ],
      data: ledger,
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 1020 }}>
      {/* Header */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Link href="/customers" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
            ← সকল কাস্টমার তালিকায় ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>👤 কাস্টমার প্রোফাইল ও বাকি খতিয়ান (Customer Ledger)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            ব্যক্তিগত লেনদেন বিবরণী, বাকির খাতা ও পেমেন্ট রিসিট।
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨️ প্রিন্ট স্টেটমেন্ট
          </button>
          <button onClick={() => setIsCollectDueOpen(true)} className="btn-primary">
            💵 বকেয়া আদায় করুন
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{customer.name}</h2>
              <span className="badge badge-primary">{customer.type}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
              <div>📞 মোবাইল: <strong>{customer.phone}</strong> {customer.email ? `• ✉️ ${customer.email}` : ""}</div>
              <div>📍 ঠিকানা: {customer.address}</div>
              <div>📅 কাস্টমার রেজিস্ট্রেশন: {formatDate(customer.joiningDate)}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ background: "var(--bg-subtle)", padding: "12px 18px", borderRadius: 8, textAlign: "right" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>বর্তমান বকেয়া (Due):</span>
              <strong style={{ fontSize: 22, color: customer.dueBalance > 0 ? "var(--danger)" : "var(--success)" }}>
                {formatCurrency(customer.dueBalance)}
              </strong>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "12px 18px", borderRadius: 8, textAlign: "right" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>ক্রেডিট লিমিট:</span>
              <strong style={{ fontSize: 18, color: "var(--primary-dark)" }}>
                {formatCurrency(customer.creditLimit)}
              </strong>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "12px 18px", borderRadius: 8, textAlign: "right" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>লয়্যালটি পয়েন্ট:</span>
              <strong style={{ fontSize: 18, color: "var(--success)" }}>
                ⭐ {customer.loyaltyPoints}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট কেনাকাটা (Lifetime Purchase)</span>
          <div className="stat-card-value">{formatCurrency(customer.totalPurchasedLifetime)}</div>
          <div className="stat-card-sub">দোকান থেকে মোট ক্রয়ের পরিমাণ</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট পরিশোধ (Lifetime Paid)</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(customer.totalPaidLifetime)}
          </div>
          <div className="stat-card-sub">নগদ ও ডিজিটাল মাধ্যমে পরিশোধিত</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">ক্রেডিট লিমিট অবশিষ্ট</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatCurrency(Math.max(0, customer.creditLimit - customer.dueBalance))}
          </div>
          <div className="stat-card-sub">আরও যত টাকা বাকিতে নিতে পারবেন</div>
        </div>
      </div>

      {/* Ledger Statement Table */}
      <div className="table-container" style={{ background: "#ffffff" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800 }}>খতিয়ান বিবরণী ও লেনদেন হিস্ট্রি (Debit / Credit Statement)</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>সকল বিক্রয় ইনভয়েস, বকেয়া আদায় ও রিফান্ড সমন্বয়।</span>
          </div>
          <span className="badge badge-neutral">Statement Verified</span>
        </div>

        <table className="erp-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>ইনভয়েস / ভাউচার নং</th>
              <th>লেনদেনের বিবরণ</th>
              <th style={{ textAlign: "right" }}>ডেবিট (ক্রয় বিল ৳)</th>
              <th style={{ textAlign: "right" }}>ক্রেডিট (জমা / পরিশোধ ৳)</th>
              <th style={{ textAlign: "right" }}>চলমান বকেয়া (Balance Due)</th>
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
                <td style={{ textAlign: "right", color: tx.debit > 0 ? "var(--text-main)" : "var(--text-muted)" }}>
                  {tx.debit > 0 ? formatCurrency(tx.debit) : "--"}
                </td>
                <td style={{ textAlign: "right", color: "var(--success)", fontWeight: 700 }}>
                  {tx.credit > 0 ? `+ ${formatCurrency(tx.credit)}` : "--"}
                </td>
                <td style={{ textAlign: "right", fontWeight: 800, color: tx.runningBalance > 0 ? "var(--danger)" : "var(--success)" }}>
                  {formatCurrency(tx.runningBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: COLLECT DUE PAYMENT */}
      {isCollectDueOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>💵 কাস্টমার বকেয়া আদায় (Collect Due)</h2>
              <button onClick={() => setIsCollectDueOpen(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <div>কাস্টমার: <strong>{customer.name}</strong></div>
              <div>বর্তমান মোট বকেয়া: <strong style={{ color: "var(--danger)" }}>{formatCurrency(customer.dueBalance)}</strong></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>আদায়ের পরিমাণ (BDT) *</label>
                <input
                  type="number"
                  min="1"
                  max={customer.dueBalance}
                  value={collectionAmount}
                  onChange={(e) => setCollectionAmount(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700, fontSize: 16 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পেমেন্ট মাধ্যম *</label>
                <select
                  value={collectionMethod}
                  onChange={(e) => setCollectionMethod(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                >
                  <option value="CASH">ক্যাশ কাউন্টার (Cash)</option>
                  <option value="BKASH">bKash Merchant</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="BANK">Bank Deposit / Cheque</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button onClick={() => setIsCollectDueOpen(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button
                  onClick={() => {
                    alert(`✓ ${formatCurrency(collectionAmount)} বকেয়া সফলভাবে জমা নেওয়া হয়েছে!`);
                    setIsCollectDueOpen(false);
                  }}
                  className="btn-primary"
                >
                  ✓ আদায় নিশ্চিত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
