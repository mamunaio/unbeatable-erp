"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

export default function ProfitLossPage() {
  const [period, setPeriod] = useState("THIS_MONTH");

  // Financial Figures
  const grossSales = 465000;
  const salesReturns = 3500;
  const discounts = 2600;
  const netSalesRevenue = grossSales - salesReturns - discounts;

  const openingStock = 145000;
  const purchases = 310000;
  const closingStock = 185400;
  const cogs = openingStock + purchases - closingStock; // 269,600

  const grossProfit = netSalesRevenue - cogs; // 189,300
  const grossMarginPercent = ((grossProfit / netSalesRevenue) * 100).toFixed(1);

  const expenses = [
    { title: "দোকান ভাড়া (Shop Rent)", amount: 25000 },
    { title: "বিদ্যুৎ ও ইউটিলিটি বিল (DESCO/Water)", amount: 4500 },
    { title: "কর্মচারী বেতন (Staff Salaries)", amount: 32000 },
    { title: "আপ্যায়ন ও দৈনন্দিন খরচ (Entertainment)", amount: 1850 },
    { title: "মেরামত ও দোকান রক্ষণাবেক্ষণ (Maintenance)", amount: 2100 },
  ];

  const totalOperatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0); // 65,450
  const netProfit = grossProfit - totalOperatingExpenses; // 123,850
  const netMarginPercent = ((netProfit / netSalesRevenue) * 100).toFixed(1);

  const handleExport = () => {
    exportToCsv({
      filename: "Profit_and_Loss_Statement",
      headers: [
        { key: "category", label: "Financial Statement Item" },
        { key: "amount", label: "Amount (BDT)" },
      ],
      data: [
        { category: "1. Gross Sales Revenue", amount: grossSales },
        { category: "Less: Sales Returns", amount: -salesReturns },
        { category: "Less: Discounts", amount: -discounts },
        { category: "Net Sales Revenue", amount: netSalesRevenue },
        { category: "2. Cost of Goods Sold (COGS)", amount: cogs },
        { category: "Gross Profit", amount: grossProfit },
        ...expenses.map((e) => ({ category: `Expense: ${e.title}`, amount: e.amount })),
        { category: "Total Operating Expenses", amount: totalOperatingExpenses },
        { category: "Net Profit", amount: netProfit },
      ],
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="no-print" style={{ marginBottom: 24 }}>
        <Link href="/reports" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← সকল রিপোর্টে ফিরে যান
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>📊 পূর্ণাঙ্গ লাভ-ক্ষতি বিবরণী (Profit & Loss Statement)</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের মোট আয়, পণ্যের ক্রয় খরচ, পরিচালন ব্যয় ও নিট মুনাফা।</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
            <button onClick={() => window.print()} className="btn-primary">🖨️ প্রিন্ট বিবরণী</button>
          </div>
        </div>
      </div>

      {/* Statement Sheet Card */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid var(--border-color)", paddingBottom: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>UNBEATABLE SUPER STORE</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>আয় ও ব্যয় বিবরণী (Profit & Loss Statement)</p>
          <span className="badge badge-neutral" style={{ marginTop: 6 }}>সময়কাল: চলতি মাস (সেপ্টেম্বর ২০২৬)</span>
        </div>

        {/* Section 1: Revenue */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 10 }}>১. বিক্রয় আয় (Operating Revenue)</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
            <span>মোট বিক্রয় (Gross Sales)</span>
            <span>{formatCurrency(grossSales)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "var(--text-muted)" }}>
            <span>বাদ: বিক্রয় ফেরত (Sales Returns)</span>
            <span>- {formatCurrency(salesReturns)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "var(--text-muted)" }}>
            <span>বাদ: দেওয়া ছাড় (Discounts Given)</span>
            <span>- {formatCurrency(discounts)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 700, borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
            <span>নিট বিক্রয় আয় (Net Sales Revenue)</span>
            <strong style={{ color: "var(--primary)" }}>{formatCurrency(netSalesRevenue)}</strong>
          </div>
        </div>

        {/* Section 2: COGS */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 10 }}>২. বিক্রিত পণ্যের ব্যয় (Cost of Goods Sold - COGS)</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "var(--text-muted)" }}>
            <span>প্রারম্ভিক মজুদ (Opening Stock)</span>
            <span>{formatCurrency(openingStock)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "var(--text-muted)" }}>
            <span>যোগ: নতুন ক্রয় (Purchases)</span>
            <span>+ {formatCurrency(purchases)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "var(--text-muted)" }}>
            <span>বাদ: সমাপনী মজুদ (Closing Stock)</span>
            <span>- {formatCurrency(closingStock)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 700, borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
            <span>মোট পণ্যের ক্রয় খরচ (Total COGS)</span>
            <strong style={{ color: "var(--danger)" }}>{formatCurrency(cogs)}</strong>
          </div>
        </div>

        {/* Gross Profit Callout */}
        <div style={{ padding: "14px 18px", background: "var(--success-bg)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <strong style={{ fontSize: 16, color: "var(--success-text)", display: "block" }}>মোট গ্রস লাভ (Gross Profit)</strong>
            <span style={{ fontSize: 12, color: "var(--success-text)" }}>গ্রস মার্জিন: {grossMarginPercent}%</span>
          </div>
          <strong style={{ fontSize: 22, color: "var(--success-text)" }}>{formatCurrency(grossProfit)}</strong>
        </div>

        {/* Section 3: Operating Expenses */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 10 }}>৩. দোকান পরিচালন ব্যয় (Operating Expenses)</h3>
          {expenses.map((e) => (
            <div key={e.title} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
              <span>{e.title}</span>
              <span>{formatCurrency(e.amount)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 700, borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
            <span>মোট পরিচালন ব্যয় (Total Operating Expenses)</span>
            <strong style={{ color: "var(--danger)" }}>{formatCurrency(totalOperatingExpenses)}</strong>
          </div>
        </div>

        {/* Final Net Profit */}
        <div style={{ padding: "18px 20px", background: "var(--primary-light)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: 18, color: "var(--primary-dark)", display: "block" }}>নিট পরিচালন মুনাফা (Net Operating Profit)</strong>
            <span style={{ fontSize: 13, color: "var(--primary-dark)" }}>নিট প্রফিট মার্জিন: {netMarginPercent}%</span>
          </div>
          <strong style={{ fontSize: 26, color: "var(--primary-dark)" }}>{formatCurrency(netProfit)}</strong>
        </div>
      </div>
    </main>
  );
}
