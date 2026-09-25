"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

type AccountType = "CASH" | "BANK" | "MOBILE_MONEY";

interface FinancialAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  type: AccountType;
  balance: number;
  branchName?: string;
  isActive: boolean;
}

interface AccountTransaction {
  id: string;
  date: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "POS_COLLECTION" | "EXPENSE_PAYMENT" | "SUPPLIER_PAYMENT";
  fromAccountId?: string;
  fromAccountName?: string;
  toAccountId?: string;
  toAccountName?: string;
  amount: number;
  referenceNo: string;
  description: string;
  isReconciled: boolean;
}

const initialAccounts: FinancialAccount[] = [
  { id: "acc-cash", name: "দোকানের ক্যাশ ড্রয়ার (Cash in Hand)", accountNumber: "CASH-MAIN", bankName: "Cash Counter", type: "CASH", balance: 45200, isActive: true },
  { id: "acc-dbbl", name: "Dutch-Bangla Bank Current A/C", accountNumber: "117.110.892100", bankName: "DBBL", branchName: "Uttara Branch", type: "BANK", balance: 245000, isActive: true },
  { id: "acc-brac", name: "BRAC Bank Corporate A/C", accountNumber: "150.120.443912", bankName: "BRAC Bank", branchName: "Gulshan-1 Branch", type: "BANK", balance: 140000, isActive: true },
  { id: "acc-bkash", name: "bKash Merchant Wallet", accountNumber: "01711-223344", bankName: "bKash", type: "MOBILE_MONEY", balance: 34500, isActive: true },
  { id: "acc-nagad", name: "Nagad Merchant Wallet", accountNumber: "01819-876543", bankName: "Nagad", type: "MOBILE_MONEY", balance: 20300, isActive: true },
];

const initialTransactions: AccountTransaction[] = [
  {
    id: "tx-1",
    date: "2026-09-25T16:30:00",
    type: "TRANSFER",
    fromAccountId: "acc-bkash",
    fromAccountName: "bKash Merchant Wallet",
    toAccountId: "acc-dbbl",
    toAccountName: "Dutch-Bangla Bank Current A/C",
    amount: 25000,
    referenceNo: "TRX-BK-992140",
    description: "বিকাশ মার্চেন্ট থেকে DBBL ব্যাংকে অটো-সেটেলমেন্ট ট্রান্সফার",
    isReconciled: true,
  },
  {
    id: "tx-2",
    date: "2026-09-25T14:15:00",
    type: "DEPOSIT",
    fromAccountId: "acc-cash",
    fromAccountName: "দোকানের ক্যাশ ড্রয়ার (Cash in Hand)",
    toAccountId: "acc-brac",
    toAccountName: "BRAC Bank Corporate A/C",
    amount: 30000,
    referenceNo: "DEP-SLIP-7712",
    description: "গতকালের ক্যাশ সেলস ব্যাংকে জমা",
    isReconciled: true,
  },
  {
    id: "tx-3",
    date: "2026-09-24T18:00:00",
    type: "POS_COLLECTION",
    toAccountId: "acc-bkash",
    toAccountName: "bKash Merchant Wallet",
    amount: 8500,
    referenceNo: "POS-BK-0924",
    description: "POS কাউন্টার বিকাশ পেমেন্ট কালেকশন",
    isReconciled: true,
  },
  {
    id: "tx-4",
    date: "2026-09-24T11:20:00",
    type: "WITHDRAWAL",
    fromAccountId: "acc-dbbl",
    fromAccountName: "Dutch-Bangla Bank Current A/C",
    toAccountId: "acc-cash",
    toAccountName: "দোকানের ক্যাশ ড্রয়ার (Cash in Hand)",
    amount: 15000,
    referenceNo: "CHQ-892100",
    description: "দোকানের পেট্রিক্যাশ ও দৈনিক খরচের জন্য উত্তোলন",
    isReconciled: true,
  },
  {
    id: "tx-5",
    date: "2026-09-23T15:00:00",
    type: "SUPPLIER_PAYMENT",
    fromAccountId: "acc-dbbl",
    fromAccountName: "Dutch-Bangla Bank Current A/C",
    amount: 50000,
    referenceNo: "EFT-881923",
    description: "সাপ্লায়ার স্কয়ার কনজিউমারকে বিল পরিশোধ",
    isReconciled: false,
  },
];

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<AccountTransaction[]>(initialTransactions);
  const [activeAccountFilter, setActiveAccountFilter] = useState<string>("ALL");

  // Transfer / Deposit / Withdrawal Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<"DEPOSIT" | "WITHDRAWAL" | "TRANSFER">("TRANSFER");
  const [fromAcc, setFromAcc] = useState("acc-cash");
  const [toAcc, setToAcc] = useState("acc-dbbl");
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transferRef, setTransferRef] = useState("");
  const [transferNote, setTransferNote] = useState("");

  // New Account Modal
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newAcc, setNewAcc] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    type: "BANK" as AccountType,
    openingBalance: 0,
  });

  // Total Calculations
  const totalLiquidCash = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalBankBalance = accounts.filter((a) => a.type === "BANK").reduce((sum, a) => sum + a.balance, 0);
  const totalMobileWallets = accounts.filter((a) => a.type === "MOBILE_MONEY").reduce((sum, a) => sum + a.balance, 0);
  const cashInHand = accounts.find((a) => a.type === "CASH")?.balance || 0;

  // Filtered Transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (activeAccountFilter === "ALL") return true;
    return tx.fromAccountId === activeAccountFilter || tx.toAccountId === activeAccountFilter;
  });

  // Handle Transfer / Deposit / Withdrawal Execution
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0) {
      alert("অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন!");
      return;
    }

    if (fromAcc === toAcc) {
      alert("উৎস এবং গন্তব্য অ্যাকাউন্ট ভিন্ন হতে হবে!");
      return;
    }

    const sourceAccount = accounts.find((a) => a.id === fromAcc);
    const destAccount = accounts.find((a) => a.id === toAcc);

    if (!sourceAccount || !destAccount) return;

    if (sourceAccount.balance < transferAmount) {
      alert(`অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: ${formatCurrency(sourceAccount.balance)}`);
      return;
    }

    // Update balances
    setAccounts(
      accounts.map((a) => {
        if (a.id === fromAcc) return { ...a, balance: a.balance - transferAmount };
        if (a.id === toAcc) return { ...a, balance: a.balance + transferAmount };
        return a;
      })
    );

    // Record transaction
    const newTx: AccountTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: transferType,
      fromAccountId: fromAcc,
      fromAccountName: sourceAccount.name,
      toAccountId: toAcc,
      toAccountName: destAccount.name,
      amount: transferAmount,
      referenceNo: transferRef || `TRX-${Date.now().toString().slice(-6)}`,
      description: transferNote || `${sourceAccount.name} থেকে ${destAccount.name} এ ফান্ড ট্রান্সফার`,
      isReconciled: true,
    };

    setTransactions([newTx, ...transactions]);
    setShowTransferModal(false);
    setTransferAmount(5000);
    setTransferRef("");
    setTransferNote("");
  };

  // Add New Account
  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.name || !newAcc.accountNumber) {
      alert("অনুগ্রহ করে অ্যাকাউন্টের নাম ও নম্বর পূরণ করুন!");
      return;
    }

    const created: FinancialAccount = {
      id: `acc-${Date.now()}`,
      name: newAcc.name,
      accountNumber: newAcc.accountNumber,
      bankName: newAcc.bankName || "Commercial Bank",
      branchName: newAcc.branchName,
      type: newAcc.type,
      balance: Number(newAcc.openingBalance) || 0,
      isActive: true,
    };

    setAccounts([...accounts, created]);
    setShowNewAccountModal(false);
    setNewAcc({
      name: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      type: "BANK",
      openingBalance: 0,
    });
  };

  // Toggle Reconciliation
  const handleToggleReconciliation = (txId: string) => {
    setTransactions(
      transactions.map((tx) => {
        if (tx.id === txId) {
          return { ...tx, isReconciled: !tx.isReconciled };
        }
        return tx;
      })
    );
  };

  // Export CSV
  const handleExportCsv = () => {
    exportToCsv({
      filename: "Bank_Accounts_and_Ledger_Statement",
      headers: [
        { key: "date", label: "Date & Time" },
        { key: "type", label: "Transaction Type" },
        { key: "fromAccountName", label: "From Account" },
        { key: "toAccountName", label: "To Account" },
        { key: "amount", label: "Amount (BDT)" },
        { key: "referenceNo", label: "Reference / Cheque No" },
        { key: "description", label: "Description" },
        { key: "isReconciled", label: "Bank Reconciled" },
      ],
      data: filteredTransactions,
    });
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🏦 ব্যাংক ও ফাইন্যান্সিয়াল অ্যাকাউন্টস (Bank & Cash Management)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            দোকানের ক্যাশ ড্রয়ার, ব্যাংক অ্যাকাউন্ট, বিকাশ/নগদ মার্চেন্ট ওয়ালেট ব্যালেন্স ও ফান্ড ট্রান্সফার লেজার।
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button
            onClick={() => {
              setTransferType("TRANSFER");
              setShowTransferModal(true);
            }}
            className="btn-secondary"
            style={{ background: "var(--primary-light)", color: "var(--primary-dark)", borderColor: "var(--primary)" }}
          >
            🔄 ফান্ড ট্রান্সফার / জমা / উত্তোলন
          </button>
          <button onClick={() => setShowNewAccountModal(true)} className="btn-primary">
            ＋ নতুন ব্যাংক একাউন্ট
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট তরল ক্যাশ ও ফান্ড</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatCurrency(totalLiquidCash)}
          </div>
          <div className="stat-card-sub">ক্যাশ + ব্যাংক + মোবাইল ওয়ালেট</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">মোট ব্যাংক ব্যালেন্স</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(totalBankBalance)}
          </div>
          <div className="stat-card-sub">DBBL, BRAC Bank ইত্যাদি</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">বিকাশ ও নগদ মার্চেন্ট</span>
          <div className="stat-card-value">{formatCurrency(totalMobileWallets)}</div>
          <div className="stat-card-sub">POS ডিজিটাল পেমেন্ট কালেকশন</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">কাউন্টার ক্যাশ ড্রয়ার</span>
          <div className="stat-card-value">{formatCurrency(cashInHand)}</div>
          <div className="stat-card-sub">হাতে থাকা নগদ টাকা</div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>সকল সক্রিয় অ্যাকাউন্ট ও বর্তমান ব্যালেন্স</h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>রিয়েলটাইম স্বয়ংক্রিয় আপডেট</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="card"
              style={{
                padding: 18,
                border: activeAccountFilter === acc.id ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() => setActiveAccountFilter(activeAccountFilter === acc.id ? "ALL" : acc.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    {acc.type === "CASH" ? "💵 CASH IN HAND" : acc.type === "BANK" ? "🏦 COMMERCIAL BANK" : "📱 MFS WALLET"}
                  </span>
                  <strong style={{ fontSize: 15, display: "block", color: "var(--text-main)", marginTop: 2 }}>{acc.name}</strong>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)" }}>
                    {acc.accountNumber} {acc.branchName ? `(${acc.branchName})` : ""}
                  </span>
                </div>
                {activeAccountFilter === acc.id && <span className="badge badge-primary">Filtered</span>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: 10, marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>বর্তমান ব্যালেন্স:</span>
                <strong style={{ fontSize: 20, color: "var(--primary-dark)" }}>{formatCurrency(acc.balance)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction & Reconciliation Ledger */}
      <div className="table-container">
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>ব্যাংক ও ক্যাশ ট্রানজেকশন লেজার (Account Ledger)</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {activeAccountFilter === "ALL" ? "সকল অ্যাকাউন্টের সম্মিলিত লেনদেন" : `ফিল্টারকৃত অ্যাকাউন্ট: ${accounts.find((a) => a.id === activeAccountFilter)?.name}`}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {activeAccountFilter !== "ALL" && (
              <button onClick={() => setActiveAccountFilter("ALL")} className="btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
                ✕ ফিল্টার রিসেট
              </button>
            )}
            <Link href="/reports/balance-sheet" className="btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
              🏛️ পূর্ণাঙ্গ ব্যালেন্স শিট দেখুন
            </Link>
          </div>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>লেনদেনের ধরন</th>
              <th>উৎস ও গন্তব্য একাউন্ট</th>
              <th>রেফারেন্স / চেক নং</th>
              <th>টাকার পরিমাণ</th>
              <th>বিবরণ ও বিবরণী</th>
              <th>রিকনসিলেশন স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDateTime(tx.date)}</td>
                <td>
                  <span
                    className={`badge ${
                      tx.type === "DEPOSIT" || tx.type === "POS_COLLECTION"
                        ? "badge-success"
                        : tx.type === "WITHDRAWAL" || tx.type === "EXPENSE_PAYMENT" || tx.type === "SUPPLIER_PAYMENT"
                        ? "badge-danger"
                        : "badge-primary"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {tx.fromAccountName && <span style={{ color: "var(--danger)" }}>{tx.fromAccountName}</span>}
                    {tx.fromAccountName && tx.toAccountName && <span style={{ margin: "0 6px", color: "var(--text-muted)" }}>➔</span>}
                    {tx.toAccountName && <span style={{ color: "var(--success)" }}>{tx.toAccountName}</span>}
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{tx.referenceNo}</span>
                </td>
                <td>
                  <strong style={{ fontSize: 14, color: "var(--text-main)" }}>{formatCurrency(tx.amount)}</strong>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{tx.description}</span>
                </td>
                <td>
                  {tx.isReconciled ? (
                    <span className="badge badge-success">✓ Reconciled</span>
                  ) : (
                    <span className="badge badge-warning">⏳ Uncleared</span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => handleToggleReconciliation(tx.id)}
                    className="btn-secondary"
                    style={{ padding: "3px 8px", fontSize: 11 }}
                  >
                    {tx.isReconciled ? "Unmark" : "✓ Cleared"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: FUND TRANSFER / DEPOSIT / WITHDRAWAL */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🔄 ফান্ড ট্রান্সফার / ব্যাংকে জমা / উত্তোলন</h2>
              <button onClick={() => setShowTransferModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>লেনদেনের ধরন *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferType("DEPOSIT");
                      setFromAcc("acc-cash");
                      setToAcc("acc-dbbl");
                    }}
                    style={{
                      padding: "8px 0",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      border: transferType === "DEPOSIT" ? "2px solid var(--success)" : "1px solid var(--border-color)",
                      background: transferType === "DEPOSIT" ? "rgba(16, 185, 129, 0.1)" : "#fff",
                      color: transferType === "DEPOSIT" ? "var(--success)" : "var(--text-main)",
                      cursor: "pointer",
                    }}
                  >
                    📥 ব্যাংকে জমা (Deposit)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferType("WITHDRAWAL");
                      setFromAcc("acc-dbbl");
                      setToAcc("acc-cash");
                    }}
                    style={{
                      padding: "8px 0",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      border: transferType === "WITHDRAWAL" ? "2px solid var(--danger)" : "1px solid var(--border-color)",
                      background: transferType === "WITHDRAWAL" ? "rgba(239, 68, 68, 0.1)" : "#fff",
                      color: transferType === "WITHDRAWAL" ? "var(--danger)" : "var(--text-main)",
                      cursor: "pointer",
                    }}
                  >
                    📤 ক্যাশ উত্তোলন (Withdraw)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType("TRANSFER")}
                    style={{
                      padding: "8px 0",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      border: transferType === "TRANSFER" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                      background: transferType === "TRANSFER" ? "var(--primary-light)" : "#fff",
                      color: transferType === "TRANSFER" ? "var(--primary-dark)" : "var(--text-main)",
                      cursor: "pointer",
                    }}
                  >
                    🔄 অ্যাকাউন্ট ট্রান্সফার
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>উৎস অ্যাকাউন্ট (From) *</label>
                  <select
                    value={fromAcc}
                    onChange={(e) => setFromAcc(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>গন্তব্য অ্যাকাউন্ট (To) *</label>
                  <select
                    value={toAcc}
                    onChange={(e) => setToAcc(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>টাকার পরিমাণ (BDT) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700, fontSize: 15 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>চেক / ডিপোজিট স্লিপ / TrxID</label>
                  <input
                    placeholder="যেমন: CHQ-99124 বা স্লিপ নং"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>লেনদেনের বিবরণ / নোট</label>
                <input
                  placeholder="যেমন: চলতি সপ্তাহের ক্যাশ জমা বা জরুরি উত্তোলন"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  ✓ লেনদেন নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW ACCOUNT */}
      {showNewAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🏦 নতুন ব্যাংক / ওয়ালেট অ্যাকাউন্ট যোগ করুন</h2>
              <button onClick={() => setShowNewAccountModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewAccount} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>অ্যাকাউন্টের ধরন *</label>
                <select
                  value={newAcc.type}
                  onChange={(e) => setNewAcc({ ...newAcc, type: e.target.value as AccountType })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                >
                  <option value="BANK">Commercial Bank (ব্যাংক অ্যাকাউন্ট)</option>
                  <option value="MOBILE_MONEY">Mobile Money (বিকাশ / নগদ / রকেট মার্চেন্ট)</option>
                  <option value="CASH">Cash Counter (ক্যাশ কাউন্টার)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>অ্যাকাউন্টের নাম / উপাধি *</label>
                <input
                  required
                  placeholder="যেমন: City Bank Principal Branch Current A/C"
                  value={newAcc.name}
                  onChange={(e) => setNewAcc({ ...newAcc, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>অ্যাকাউন্ট নম্বর / ওয়ালেট নং *</label>
                  <input
                    required
                    placeholder="যেমন: 210.140.998120"
                    value={newAcc.accountNumber}
                    onChange={(e) => setNewAcc({ ...newAcc, accountNumber: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ব্যাংক / ওয়ালেটের নাম</label>
                  <input
                    placeholder="যেমন: City Bank / bKash"
                    value={newAcc.bankName}
                    onChange={(e) => setNewAcc({ ...newAcc, bankName: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>শাখার নাম (Branch)</label>
                  <input
                    placeholder="যেমন: Dhanmondi Branch"
                    value={newAcc.branchName}
                    onChange={(e) => setNewAcc({ ...newAcc, branchName: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>প্রারম্ভিক ব্যালেন্স (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={newAcc.openingBalance}
                    onChange={(e) => setNewAcc({ ...newAcc, openingBalance: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowNewAccountModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
