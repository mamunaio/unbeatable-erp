"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

export default function BalanceSheetPage() {
  const [asOfDate] = useState("2026-09-25");

  // ASSETS
  // 1. Current Assets
  const cashInHand = 45200;
  const bankAccounts = 385000;
  const mobileMoney = 54800;
  const accountsReceivable = 68400; // Customer Due
  const inventoryStockValue = 425600; // Valuation at cost
  const advanceSuppliers = 15000;
  const totalCurrentAssets =
    cashInHand + bankAccounts + mobileMoney + accountsReceivable + inventoryStockValue + advanceSuppliers; // 994,000

  // 2. Non-Current Assets (Fixed Assets)
  const shopFixtures = 120000;
  const posHardware = 45000;
  const securityDeposit = 150000;
  const accumulatedDepreciation = 15000;
  const totalNonCurrentAssets = shopFixtures + posHardware + securityDeposit - accumulatedDepreciation; // 300,000

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets; // 1,294,000

  // LIABILITIES
  // 1. Current Liabilities
  const accountsPayable = 112000; // Supplier Due
  const accruedExpenses = 18500; // Outstanding Rent/Utilities
  const customerAdvances = 13500;
  const vatPayable = 8500;
  const totalCurrentLiabilities = accountsPayable + accruedExpenses + customerAdvances + vatPayable; // 152,500

  // 2. Long-Term Liabilities
  const bankLoan = 200000;
  const totalLiabilities = totalCurrentLiabilities + bankLoan; // 352,500

  // EQUITY
  const ownerCapital = 750000;
  const retainedEarnings = 67650;
  const currentPeriodProfit = 123850;
  const totalEquity = ownerCapital + retainedEarnings + currentPeriodProfit; // 941,500

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity; // 1,294,000
  const isBalanced = totalAssets === totalLiabilitiesAndEquity;

  const handleExport = () => {
    exportToCsv({
      filename: `Balance_Sheet_${asOfDate}`,
      headers: [
        { key: "category", label: "Balance Sheet Item" },
        { key: "subCategory", label: "Type" },
        { key: "amount", label: "Amount (BDT)" },
      ],
      data: [
        { category: "Cash in Hand & Drawer", subCategory: "Current Asset", amount: cashInHand },
        { category: "Bank Accounts Balance", subCategory: "Current Asset", amount: bankAccounts },
        { category: "bKash & Nagad Merchant Wallets", subCategory: "Current Asset", amount: mobileMoney },
        { category: "Accounts Receivable (Customer Due)", subCategory: "Current Asset", amount: accountsReceivable },
        { category: "Merchandise Inventory Stock", subCategory: "Current Asset", amount: inventoryStockValue },
        { category: "Advance to Suppliers", subCategory: "Current Asset", amount: advanceSuppliers },
        { category: "Total Current Assets", subCategory: "Subtotal", amount: totalCurrentAssets },
        { category: "Shop Fixtures & Interior", subCategory: "Non-Current Asset", amount: shopFixtures },
        { category: "POS Computers & Barcode Hardware", subCategory: "Non-Current Asset", amount: posHardware },
        { category: "Shop Lease Security Deposit", subCategory: "Non-Current Asset", amount: securityDeposit },
        { category: "Less: Accumulated Depreciation", subCategory: "Contra Asset", amount: -accumulatedDepreciation },
        { category: "Total Assets", subCategory: "TOTAL ASSETS", amount: totalAssets },
        { category: "Accounts Payable (Supplier Due)", subCategory: "Current Liability", amount: accountsPayable },
        { category: "Accrued Expenses (Rent & Utilities)", subCategory: "Current Liability", amount: accruedExpenses },
        { category: "Customer Advances / Prepayments", subCategory: "Current Liability", amount: customerAdvances },
        { category: "VAT / Tax Payable", subCategory: "Current Liability", amount: vatPayable },
        { category: "Bank Term Loan", subCategory: "Long-Term Liability", amount: bankLoan },
        { category: "Total Liabilities", subCategory: "TOTAL LIABILITIES", amount: totalLiabilities },
        { category: "Owner Capital Invested", subCategory: "Owner Equity", amount: ownerCapital },
        { category: "Retained Earnings", subCategory: "Owner Equity", amount: retainedEarnings },
        { category: "Current Period Net Profit", subCategory: "Owner Equity", amount: currentPeriodProfit },
        { category: "Total Equity", subCategory: "TOTAL EQUITY", amount: totalEquity },
        { category: "Total Liabilities & Equity", subCategory: "TOTAL LIABILITIES & EQUITY", amount: totalLiabilitiesAndEquity },
      ],
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 960 }}>
      {/* Header */}
      <div className="no-print" style={{ marginBottom: 24 }}>
        <Link href="/reports" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← সকল রিপোর্টে ফিরে যান
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🏛️ আর্থিক ব্যালেন্স শিট (Balance Sheet Statement)</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              দোকানের মোট সম্পত্তি (Assets), দায় (Liabilities) এবং ওনার্স ইকুইটির পুঙ্খানুপুঙ্খ আর্থিক বিবরণী।
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
            <button onClick={() => window.print()} className="btn-primary">🖨️ প্রিন্ট শিট</button>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      <div
        className="no-print"
        style={{
          padding: "14px 20px",
          background: isBalanced ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          border: `1.5px solid ${isBalanced ? "var(--success)" : "var(--danger)"}`,
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <strong style={{ fontSize: 15, color: isBalanced ? "var(--success)" : "var(--danger)", display: "block" }}>
            {isBalanced ? "✓ হিসাব সম্পূর্ণ নির্ভুল ও ব্যালান্সড (Assets = Liabilities + Equity)" : "⚠️ অসামঞ্জস্য রয়েছে"}
          </strong>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            মোট সম্পদ: {formatCurrency(totalAssets)} | মোট দায় ও মূলধন: {formatCurrency(totalLiabilitiesAndEquity)}
          </span>
        </div>
        <span className={`badge ${isBalanced ? "badge-success" : "badge-danger"}`} style={{ fontSize: 13, padding: "6px 12px" }}>
          {isBalanced ? "BALANCED" : "UNBALANCED"}
        </span>
      </div>

      {/* Main Statement Paper */}
      <div className="card" style={{ padding: 36, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid var(--border-color)", paddingBottom: 16, marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>UNBEATABLE RETAIL ERP</h2>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main)", marginTop: 2 }}>উদ্বৃত্তপত্র / ব্যালেন্স শিট (Statement of Financial Position)</p>
          <span className="badge badge-neutral" style={{ marginTop: 6, fontSize: 12 }}>
            তারিখ অনুযায়ী: {formatDate(asOfDate)} (Dhaka Timezone)
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* LEFT COLUMN: ASSETS */}
          <div>
            <div style={{ background: "var(--primary-light)", padding: "8px 12px", borderRadius: 6, marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--primary-dark)" }}>১. সম্পদসমূহ (ASSETS)</h3>
            </div>

            {/* Current Assets */}
            <div style={{ marginBottom: 20 }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                চলতি সম্পদ (Current Assets)
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>ক্যাশ ড্রয়ার (Cash in Hand)</span>
                <span>{formatCurrency(cashInHand)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>ব্যাংক অ্যাকাউন্টস ব্যালেন্স (Bank Balance)</span>
                <span>{formatCurrency(bankAccounts)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>বিকাশ ও নগদ মার্চেন্ট ওয়ালেট</span>
                <span>{formatCurrency(mobileMoney)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>গ্রাহকের বাকি (Accounts Receivable)</span>
                <span>{formatCurrency(accountsReceivable)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>মজুদ পণ্যের মূল্য (Inventory Stock at Cost)</span>
                <span>{formatCurrency(inventoryStockValue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>সাপ্লায়ার অ্যাডভান্স</span>
                <span>{formatCurrency(advanceSuppliers)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "1px dashed var(--border-color)", marginTop: 4 }}>
                <span>মোট চলতি সম্পদ (Total Current Assets)</span>
                <span style={{ color: "var(--primary)" }}>{formatCurrency(totalCurrentAssets)}</span>
              </div>
            </div>

            {/* Non-Current Assets */}
            <div style={{ marginBottom: 20 }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                স্থায়ী ও দীর্ঘমেয়াদি সম্পদ (Fixed Assets)
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>দোকানের ডেকোরেশন ও ফার্নিচার</span>
                <span>{formatCurrency(shopFixtures)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>POS কম্পিউটার ও বারকোড হার্ডওয়্যার</span>
                <span>{formatCurrency(posHardware)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>দোকান জামানত (Shop Lease Deposit)</span>
                <span>{formatCurrency(securityDeposit)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "var(--danger)" }}>
                <span>বাদ: পুঞ্জীভূত অবচয় (Depreciation)</span>
                <span>- {formatCurrency(accumulatedDepreciation)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "1px dashed var(--border-color)", marginTop: 4 }}>
                <span>মোট স্থায়ী সম্পদ (Total Fixed Assets)</span>
                <span style={{ color: "var(--primary)" }}>{formatCurrency(totalNonCurrentAssets)}</span>
              </div>
            </div>

            {/* Total Assets Summary Box */}
            <div style={{ padding: "12px 16px", background: "var(--primary-dark)", color: "#fff", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
              <strong style={{ fontSize: 15 }}>সর্বমোট সম্পদ (TOTAL ASSETS)</strong>
              <strong style={{ fontSize: 18 }}>{formatCurrency(totalAssets)}</strong>
            </div>
          </div>

          {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
          <div>
            <div style={{ background: "#fef3c7", padding: "8px 12px", borderRadius: 6, marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#92400e" }}>২. দায় ও মূলধন (LIABILITIES & EQUITY)</h3>
            </div>

            {/* Current Liabilities */}
            <div style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                চলতি দায় (Current Liabilities)
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>সাপ্লায়ারের পাওনা (Accounts Payable)</span>
                <span>{formatCurrency(accountsPayable)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>বকেয়া খরচ (Accrued Rent & Utilities)</span>
                <span>{formatCurrency(accruedExpenses)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>কাস্টমার অগ্রিম টাকা (Advances)</span>
                <span>{formatCurrency(customerAdvances)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>প্রদেয় ভ্যাট ও ট্যাক্স (VAT Payable)</span>
                <span>{formatCurrency(vatPayable)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "1px dashed var(--border-color)", marginTop: 4 }}>
                <span>মোট চলতি দায় (Current Liabilities)</span>
                <span style={{ color: "var(--danger)" }}>{formatCurrency(totalCurrentLiabilities)}</span>
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                দীর্ঘমেয়াদি দায় (Long-Term Debt)
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>ব্যাংক ঋণ (Bank SME Loan)</span>
                <span>{formatCurrency(bankLoan)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "1px dashed var(--border-color)", marginTop: 4 }}>
                <span>সর্বমোট দায় (Total Liabilities)</span>
                <span style={{ color: "var(--danger)" }}>{formatCurrency(totalLiabilities)}</span>
              </div>
            </div>

            {/* Owner's Equity */}
            <div style={{ marginBottom: 20 }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                মালিকানা স্বত্ব (Owner's Equity)
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>মালিকের বিনিয়োগকৃত মূলধন (Capital)</span>
                <span>{formatCurrency(ownerCapital)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span>সংরক্ষিত আয় (Retained Earnings)</span>
                <span>{formatCurrency(retainedEarnings)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "var(--success)" }}>
                <span>চলতি অর্থবছর নিট মুনাফা (Net Profit)</span>
                <span>+ {formatCurrency(currentPeriodProfit)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "1px dashed var(--border-color)", marginTop: 4 }}>
                <span>মোট মূলধন (Total Owner's Equity)</span>
                <span style={{ color: "var(--success)" }}>{formatCurrency(totalEquity)}</span>
              </div>
            </div>

            {/* Total Liabilities & Equity Box */}
            <div style={{ padding: "12px 16px", background: "#78350f", color: "#fff", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
              <strong style={{ fontSize: 15 }}>মোট দায় ও মূলধন (LIAB. & EQUITY)</strong>
              <strong style={{ fontSize: 18 }}>{formatCurrency(totalLiabilitiesAndEquity)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
