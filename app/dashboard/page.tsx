"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { QuickDueSmsModal } from "@/components/QuickDueSmsModal";
import {
  IconPos,
  IconPlus,
  IconTrendUp,
  IconSales,
  IconPurchases,
  IconCustomers,
  IconSuppliers,
  IconExpenses,
  IconInventory,
  IconLogistics,
  IconSms,
  IconReports,
  IconSpecialAddons,
  IconCash,
} from "@/components/Icons";

type PeriodType = "TODAY" | "WEEK" | "MONTH";

export default function DashboardPage() {
  const { isBengali } = useLanguage();
  const [period, setPeriod] = useState<PeriodType>("TODAY");
  const [alertTab, setAlertTab] = useState<"INVENTORY" | "OVERDUE_CUSTOMERS" | "SUPPLIER_PAYABLES">("INVENTORY");
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(6);

  // Due SMS Modal State
  const [isDueSmsModalOpen, setIsDueSmsModalOpen] = useState(false);
  const [selectedDueCustomer, setSelectedDueCustomer] = useState<{
    id: string;
    name: string;
    phone: string;
    dueAmount: number;
    lastInvoice?: string;
    invoiceDate?: string;
  } | null>(null);

  const openDueSms = (cust?: {
    id: string;
    name: string;
    phone: string;
    dueAmount: number;
    lastInvoice?: string;
    invoiceDate?: string;
  }) => {
    setSelectedDueCustomer(
      cust || {
        id: "c-101",
        name: "Kalam Store Wholesale",
        phone: "01812345678",
        dueAmount: 15400,
        lastInvoice: "INV-8921-1004",
        invoiceDate: isBengali ? "২৫ মিনিট আগে" : "25m ago",
      }
    );
    setIsDueSmsModalOpen(true);
  };

  // Period figures
  const data = {
    TODAY: {
      sales: 48650,
      profit: 11820,
      cogs: 36830,
      margin: "24.3%",
      orders: 32,
      cashInHand: 14500,
      customerDue: 18250,
      customerDueCount: 42,
      supplierPayable: 42500,
      supplierPayableCount: 3,
      lowStockCount: 3,
      nearExpiryCount: 2,
      salesGrowth: "+18.4%",
    },
    WEEK: {
      sales: 342500,
      profit: 83400,
      cogs: 259100,
      margin: "24.4%",
      orders: 218,
      cashInHand: 48500,
      customerDue: 64500,
      customerDueCount: 68,
      supplierPayable: 95000,
      supplierPayableCount: 6,
      lowStockCount: 3,
      nearExpiryCount: 2,
      salesGrowth: "+22.6%",
    },
    MONTH: {
      sales: 1480000,
      profit: 360000,
      cogs: 1120000,
      margin: "24.3%",
      orders: 940,
      cashInHand: 112000,
      customerDue: 112000,
      customerDueCount: 115,
      supplierPayable: 180000,
      supplierPayableCount: 8,
      lowStockCount: 5,
      nearExpiryCount: 4,
      salesGrowth: "+28.1%",
    },
  }[period];

  // Monthly Target Progress
  const monthlyTarget = 1500000;
  const monthlyAchieved = 1148650;
  const monthlyTargetPct = ((monthlyAchieved / monthlyTarget) * 100).toFixed(1);

  // Daily Chart Data
  const chartData = isBengali
    ? [
        { day: "শনি", date: "২০ সেপ", sales: 38000, profit: 9500, salesPct: 50, profitPct: 40 },
        { day: "রবি", date: "২১ সেপ", sales: 48000, profit: 12000, salesPct: 63, profitPct: 50 },
        { day: "সোম", date: "২২ সেপ", sales: 29000, profit: 7200, salesPct: 38, profitPct: 30 },
        { day: "মঙ্গল", date: "২৩ সেপ", sales: 45000, profit: 11200, salesPct: 59, profitPct: 47 },
        { day: "বুধ", date: "২৪ সেপ", sales: 56000, profit: 14000, salesPct: 73, profitPct: 58 },
        { day: "বৃহঃ", date: "২৫ সেপ", sales: 52000, profit: 13000, salesPct: 68, profitPct: 54 },
        { day: "শুক্র", date: "২৬ সেপ", sales: 76500, profit: 19100, salesPct: 100, profitPct: 80, isPeak: true },
      ]
    : [
        { day: "Sat", date: "20 Sep", sales: 38000, profit: 9500, salesPct: 50, profitPct: 40 },
        { day: "Sun", date: "21 Sep", sales: 48000, profit: 12000, salesPct: 63, profitPct: 50 },
        { day: "Mon", date: "22 Sep", sales: 29000, profit: 7200, salesPct: 38, profitPct: 30 },
        { day: "Tue", date: "23 Sep", sales: 45000, profit: 11200, salesPct: 59, profitPct: 47 },
        { day: "Wed", date: "24 Sep", sales: 56000, profit: 14000, salesPct: 73, profitPct: 58 },
        { day: "Thu", date: "25 Sep", sales: 52000, profit: 13000, salesPct: 68, profitPct: 54 },
        { day: "Fri", date: "26 Sep", sales: 76500, profit: 19100, salesPct: 100, profitPct: 80, isPeak: true },
      ];

  const currentHover = hoveredDayIndex !== null ? chartData[hoveredDayIndex] : chartData[6];

  // Category sales share
  const categorySales = [
    { nameBn: "মুদি ও খাদ্যসামগ্রী", nameEn: "Grocery & Foods", pct: 38, amount: 18500, color: "#8b5cf6" },
    { nameBn: "কসমেটিকস ও কেয়ার", nameEn: "Cosmetics & Care", pct: 26, amount: 12650, color: "#ec4899" },
    { nameBn: "হার্ডওয়্যার ও পেইন্টস", nameEn: "Hardware & Paints", pct: 20, amount: 9730, color: "#059669" },
    { nameBn: "দুগ্ধ ও পানীয়", nameEn: "Dairy & Beverages", pct: 16, amount: 7770, color: "#d97706" },
  ];

  // Actionable Alert Items
  const lowStockItems = [
    { name: "Miniket Premium Rice 25kg", sku: "RICE-MIN-25", currentStock: 2, reorderLevel: 10, unit: "Bags", status: "CRITICAL" },
    { name: "Rupchanda Soyabean Oil 5L", sku: "OIL-RUP-5L", currentStock: 3, reorderLevel: 15, unit: "Cans", status: "WARNING" },
    { name: "Aarong Fresh Milk 1L", sku: "MILK-AAR-1L", currentStock: 4, reorderLevel: 20, unit: "Pcs", status: "WARNING" },
  ];

  const nearExpiryItems = [
    { name: "Maybelline Fit Me Matte Foundation", sku: "MAY-FIT-120", batch: "LOT-2026-08A", daysLeft: 20, stock: 18, action: "Auto-Discount 20%" },
    { name: "Nivea Soft Moisturizing Cream 200ml", sku: "NIV-SFT-200M", batch: "LOT-2026-10-05", daysLeft: 10, stock: 12, action: "Return to Vendor" },
  ];

  const overdueCustomers = [
    { id: "c-1", name: "Kalam Store Wholesale", phone: "01812345678", due: 15400, daysOverdue: 12, invoice: "INV-8921-1004" },
    { id: "c-2", name: "Raju General Store", phone: "01719876543", due: 2850, daysOverdue: 18, invoice: "INV-8921-0988" },
  ];

  const supplierPayables = [
    { name: "Unilever Bangladesh Ltd", invoice: "PO-2026-89", amount: 18000, dueDate: isBengali ? "আজকে প্রদেয়" : "Due Today", urgent: true },
    { name: "Square Consumer Products", invoice: "PO-2026-92", amount: 24500, dueDate: isBengali ? "২ দিন বাকি" : "In 2 days", urgent: false },
  ];

  // Best Selling Products
  const bestSellers = [
    { name: "Miniket Premium Rice 25kg", sku: "RICE-MIN-25", unitsSold: 64, revenue: 118400, margin: "12.1%" },
    { name: "Rupchanda Soyabean Oil 5L", sku: "OIL-RUP-5L", unitsSold: 48, revenue: 39360, margin: "7.9%" },
    { name: "Maybelline Foundation 120", sku: "MAY-FIT-120", unitsSold: 28, revenue: 35000, margin: "38.5%" },
    { name: "Dano Full Cream Milk 1kg", sku: "MILK-DAN-1KG", unitsSold: 32, revenue: 26880, margin: "7.7%" },
    { name: "Asian Paints Royale 4L", sku: "ASN-ROY-4L", unitsSold: 6, revenue: 20700, margin: "18.2%" },
  ];

  // Recent Invoices
  const recentSales = [
    { id: "s-1", invoice: "INV-8921-1005", customer: "Rahim Chowdhury", phone: "01711223344", cashier: "Tanvir", amount: 2700, method: "bKash", time: isBengali ? "১০ মিনিট আগে" : "10m ago", status: "PAID" },
    { id: "s-2", invoice: "INV-8921-1004", customer: "Kalam Store Wholesale", phone: "01812345678", cashier: "Tanvir", amount: 15400, method: isBengali ? "বাকি" : "Due", time: isBengali ? "২৫ মিনিট আগে" : "25m ago", status: "DUE" },
    { id: "s-3", invoice: "INV-8921-1003", customer: "Walk-in Customer", phone: "01700000000", cashier: "Sumon", amount: 850, method: "Cash", time: isBengali ? "১ ঘণ্টা আগে" : "1h ago", status: "PAID" },
    { id: "s-4", invoice: "INV-8921-1002", customer: "Jamil Hossain", phone: "01911998877", cashier: "Sumon", amount: 3200, method: "Card (POS)", time: isBengali ? "২ ঘণ্টা আগে" : "2h ago", status: "PAID" },
  ];

  // Staff Activity Log
  const staffActivity = [
    { staff: "Tanvir Ahmed (Cashier)", actionBn: "ইনভয়েস #INV-1005 তৈরি ও বিকাশ পেমেন্ট সম্পন্ন", actionEn: "Created Invoice #INV-1005 (bKash)", time: isBengali ? "১০ মিনিট আগে" : "10m ago" },
    { staff: "Rafiqul Islam (Manager)", actionBn: "সাপ্লায়ার চালান #PO-92 রিসিভ ও স্টক ইনওয়ার্ড", actionEn: "Received Supplier PO #PO-92 inward", time: isBengali ? "৪৫ মিনিট আগে" : "45m ago" },
    { staff: "Sumon Mia (Cashier)", actionBn: "শিফট প্রারম্ভিক ক্যাশ ৳২,০০০ দিয়ে কাউন্টার ওপেন", actionEn: "Opened morning shift with ৳2,000 float", time: isBengali ? "২ ঘণ্টা আগে" : "2h ago" },
  ];

  return (
    <main className="page-container glass-canvas-bg" style={{ maxWidth: 1440, padding: "24px 32px" }}>
      {/* 1. Header with Period Selector & Direct Action Triggers */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#7c3aed",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(236, 72, 153, 0.12))",
                backdropFilter: "blur(8px)",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 1px 4px rgba(168, 85, 247, 0.15)",
              }}
            >
              Main Branch Outlet
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--success-text)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                background: "rgba(5, 150, 105, 0.08)",
                backdropFilter: "blur(8px)",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", display: "inline-block", boxShadow: "0 0 8px var(--success)" }} />
              {isBengali ? "২ জন ক্যাশিয়ার সক্রিয়" : "2 Cashiers On Duty"}
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.6px", margin: 0 }}>
            {isBengali ? "দোকান মালিক ড্যাশবোর্ড (Executive Overview)" : "Executive Store Dashboard"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 4 }}>
            {isBengali
              ? "ব্যবসায়িক স্বাস্থ্য, জরুরি অ্যালার্ট এবং দৈনন্দিন অপারেশনাল সিদ্ধান্ত কেন্দ্র।"
              : "Business health vitals, operational bottlenecks and immediate owner actions."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Glass Segmented Period Control */}
          <div className="glass-segmented">
            <button
              type="button"
              onClick={() => setPeriod("TODAY")}
              className={`glass-segmented-btn ${period === "TODAY" ? "active" : ""}`}
            >
              {isBengali ? "আজকে" : "Today"}
            </button>
            <button
              type="button"
              onClick={() => setPeriod("WEEK")}
              className={`glass-segmented-btn ${period === "WEEK" ? "active" : ""}`}
            >
              {isBengali ? "৭ দিন" : "7 Days"}
            </button>
            <button
              type="button"
              onClick={() => setPeriod("MONTH")}
              className={`glass-segmented-btn ${period === "MONTH" ? "active" : ""}`}
            >
              {isBengali ? "৩০ দিন" : "30 Days"}
            </button>
          </div>

          <button
            onClick={() => openDueSms()}
            className="btn-glass-sms"
          >
            <IconSms size={15} />
            <span>{isBengali ? "বাকি SMS" : "Due SMS"}</span>
          </button>

          <Link href="/expenses" className="btn-glass-item">
            <IconExpenses size={15} color="var(--text-muted)" />
            <span>{isBengali ? "খরচ এন্ট্রি" : "Add Expense"}</span>
          </Link>

          <Link href="/purchases/new" className="btn-glass-item">
            <IconPurchases size={15} color="var(--text-muted)" />
            <span>{isBengali ? "নতুন চালান" : "New PO"}</span>
          </Link>

          <Link href="/pos" className="btn-glass-pos">
            <IconPos size={16} />
            <span>{isBengali ? "POS কাউন্টার (F8)" : "POS Counter (F8)"}</span>
          </Link>
        </div>
      </div>

      {/* 2. Top-Level 6 Ultra-Glass Health KPIs (The "How is my business doing?" Grid) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* KPI 1: Total Sales */}
        <div className="ultra-glass-card glow-sales" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "আজকের মোট বিক্রয়" : "Today's Sales"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(236, 72, 153, 0.18))", borderColor: "rgba(168, 85, 247, 0.35)" }}>
              <IconSales size={17} color="#a855f7" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "var(--text-main)", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatCurrency(data.sales)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, fontSize: 11.5 }}>
            <span style={{ background: "rgba(5, 150, 105, 0.12)", color: "#065f46", padding: "2px 7px", borderRadius: 6, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 3, border: "1px solid rgba(5, 150, 105, 0.25)" }}>
              <IconTrendUp size={11} />
              {data.salesGrowth}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{data.orders} {isBengali ? "টি অর্ডার" : "orders"}</span>
          </div>
        </div>

        {/* KPI 2: Gross Profit */}
        <div className="ultra-glass-card glow-profit" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "আজকের নিট লাভ" : "Net Gross Profit"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(5, 150, 105, 0.05))", borderColor: "rgba(5, 150, 105, 0.25)" }}>
              <IconReports size={17} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "var(--success-text)", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatCurrency(data.profit)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, fontSize: 11.5 }}>
            <span style={{ background: "rgba(5, 150, 105, 0.12)", color: "var(--success-text)", padding: "2px 7px", borderRadius: 6, fontWeight: 800, border: "1px solid rgba(5, 150, 105, 0.25)" }}>
              {data.margin}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{isBengali ? "ক্রয়ব্যয়:" : "Cost:"} {formatCurrency(data.cogs)}</span>
          </div>
        </div>

        {/* KPI 3: Cash in Hand / Drawer */}
        <div className="ultra-glass-card glow-cash" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "ক্যাশ ড্রয়ার ব্যালেন্স" : "Cash in Drawer"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))", borderColor: "rgba(99, 102, 241, 0.25)" }}>
              <IconCash size={17} color="#4f46e5" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "var(--text-main)", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatCurrency(data.cashInHand)}
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--text-muted)" }}>
            {isBengali ? "প্রারম্ভিক ফ্লোট ৳২,০০০ অন্তর্ভুক্ত" : "Includes ৳2,000 float"}
          </div>
        </div>

        {/* KPI 4: Customer Due (Receivable) */}
        <div className="ultra-glass-card glow-due" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "কাস্টমার বাকি (Due)" : "Customer Due"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.05))", borderColor: "rgba(220, 38, 38, 0.25)" }}>
              <IconCustomers size={17} color="var(--danger)" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "var(--danger)", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatCurrency(data.customerDue)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11.5 }}>
            <span style={{ color: "var(--text-muted)" }}>{data.customerDueCount} {isBengali ? "জন গ্রাহক" : "customers"}</span>
            <button onClick={() => openDueSms()} style={{ border: "none", background: "transparent", color: "var(--danger)", fontWeight: 800, cursor: "pointer", padding: 0 }}>
              {isBengali ? "SMS পাঠান →" : "SMS →"}
            </button>
          </div>
        </div>

        {/* KPI 5: Supplier Payable (মহাজন বাকি) */}
        <div className="ultra-glass-card glow-supplier" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "সাপ্লায়ার দেনা (Payable)" : "Supplier Due"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(234, 88, 12, 0.05))", borderColor: "rgba(234, 88, 12, 0.25)" }}>
              <IconSuppliers size={17} color="#ea580c" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "#ea580c", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatCurrency(data.supplierPayable)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11.5 }}>
            <span style={{ color: "var(--text-muted)" }}>{data.supplierPayableCount} {isBengali ? "টি চালান প্রদেয়" : "POs due"}</span>
            <Link href="/suppliers" style={{ color: "var(--primary)", fontWeight: 800 }}>
              {isBengali ? "তালিকা →" : "List →"}
            </Link>
          </div>
        </div>

        {/* KPI 6: Risk Alerts (Low Stock + Expiry) */}
        <div className="ultra-glass-card glow-risk" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isBengali ? "ঝুঁকি সতর্কতা (Stock/Expiry)" : "Stock & Expiry Alert"}
            </span>
            <div className="glass-kpi-icon" style={{ background: "linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(217, 119, 6, 0.05))", borderColor: "rgba(217, 119, 6, 0.25)" }}>
              <IconInventory size={17} color="var(--warning)" />
            </div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: "var(--warning-text)", marginTop: 10, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {data.lowStockCount + data.nearExpiryCount} {isBengali ? "টি আইটেম" : "Items"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11.5 }}>
            <span style={{ color: "var(--text-muted)" }}>{data.lowStockCount} {isBengali ? "লো-স্টক" : "low"}, {data.nearExpiryCount} {isBengali ? "মেয়াদ" : "exp"}</span>
            <button onClick={() => setAlertTab("INVENTORY")} style={{ border: "none", background: "transparent", color: "var(--warning-text)", fontWeight: 800, cursor: "pointer", padding: 0 }}>
              {isBengali ? "রিভিউ →" : "Review"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Strategic Overview Row (65% / 35%) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 20, marginBottom: 24 }}>
        {/* Sales & Profit Trends Chart + Category Share */}
        <div className="ultra-glass-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                {isBengali ? "সাপ্তাহিক বিক্রয় ও লাভ ট্রেন্ড" : "Weekly Sales vs Profit Trend"}
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {isBengali ? "চলতি সপ্তাহের দৈনিক বিক্রয় ও মার্জিন প্যাটার্ন" : "Daily sales and profit margin patterns"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--aurora-gradient)" }} />
                {isBengali ? "বিক্রয়" : "Sales"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--success)" }} />
                {isBengali ? "নিট লাভ" : "Gross Profit"}
              </span>
            </div>
          </div>

          {/* Clean Glass Bar Chart */}
          <div
            style={{
              height: 160,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              padding: "0 8px 10px 8px",
              borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            {chartData.map((bar, idx) => {
              const isHovered = hoveredDayIndex === idx;
              return (
                <div
                  key={bar.day}
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: 4,
                      height: 120,
                    }}
                  >
                    {/* Revenue Bar */}
                    <div
                      style={{
                        width: "42%",
                        height: `${bar.salesPct}%`,
                        background: isHovered || bar.isPeak ? "var(--aurora-gradient)" : "linear-gradient(180deg, #c084fc 0%, #818cf8 100%)",
                        borderRadius: "4px 4px 0 0",
                        boxShadow: isHovered ? "0 4px 14px rgba(168, 85, 247, 0.45)" : "none",
                        transition: "all 0.18s ease",
                      }}
                    />
                    {/* Profit Bar */}
                    <div
                      style={{
                        width: "42%",
                        height: `${bar.profitPct}%`,
                        background: isHovered || bar.isPeak ? "var(--success)" : "#86efac",
                        borderRadius: "4px 4px 0 0",
                        boxShadow: isHovered ? "0 4px 12px rgba(5, 150, 105, 0.3)" : "none",
                        transition: "all 0.18s ease",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center", lineHeight: 1.1 }}>
                    <span style={{ fontSize: 11, fontWeight: isHovered ? 800 : 600, color: isHovered ? "#9333ea" : "var(--text-main)", display: "block" }}>
                      {bar.day}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{bar.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hover Day Breakdown */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
            <div>
              <strong style={{ color: "var(--text-main)" }}>{currentHover.day} ({currentHover.date}): </strong>
              <span>{isBengali ? "বিক্রয়" : "Sales"} <strong style={{ color: "#9333ea" }}>{formatCurrency(currentHover.sales)}</strong></span>
              <span style={{ margin: "0 6px" }}>•</span>
              <span>{isBengali ? "লাভ" : "Profit"} <strong style={{ color: "var(--success-text)" }}>{formatCurrency(currentHover.profit)}</strong></span>
            </div>
            <span>{isBengali ? "পিক ডে:" : "Peak:"} <strong style={{ color: "#9333ea" }}>{chartData[6].day} ({formatCurrency(chartData[6].sales)})</strong></span>
          </div>

          {/* Category Sales Share Bar */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(226, 232, 240, 0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                {isBengali ? "ক্যাটাগরি ভিত্তিক বিক্রয় শেয়ার" : "Category Sales Breakdown"}
              </span>
              <span style={{ color: "var(--text-muted)" }}>{isBengali ? "আজকের শেয়ার %" : "Today's Share"}</span>
            </div>
            <div style={{ height: 8, background: "rgba(241, 245, 249, 0.9)", borderRadius: 4, display: "flex", overflow: "hidden", marginBottom: 8, border: "1px solid rgba(226, 232, 240, 0.6)" }}>
              {categorySales.map((cat) => (
                <div key={cat.nameEn} style={{ width: `${cat.pct}%`, background: cat.color }} title={`${cat.nameEn}: ${cat.pct}%`} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11.5 }}>
              {categorySales.map((cat) => (
                <span key={cat.nameEn} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: cat.color }} />
                  {isBengali ? cat.nameBn : cat.nameEn} ({cat.pct}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Target Progress & Quick Shortcuts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Target vs Achievement Box */}
          <div className="ultra-glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {isBengali ? "এই মাসের সেলস টার্গেট" : "Monthly Sales Target"}
                </span>
                <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", marginTop: 2 }}>
                  {formatCurrency(monthlyAchieved)}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}> / {formatCurrency(monthlyTarget)}</span>
                </div>
              </div>
              <span className="badge badge-primary">{monthlyTargetPct}% {isBengali ? "অর্জিত" : "Achieved"}</span>
            </div>

            {/* Target Progress Bar */}
            <div style={{ height: 9, background: "rgba(241, 245, 249, 0.9)", borderRadius: 5, overflow: "hidden", marginBottom: 8, border: "1px solid rgba(226, 232, 240, 0.6)" }}>
              <div style={{ width: `${monthlyTargetPct}%`, height: "100%", background: "var(--aurora-gradient)", borderRadius: 5 }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-muted)" }}>
              <span>{isBengali ? "টার্গেট বাকি:" : "Remaining:"} {formatCurrency(monthlyTarget - monthlyAchieved)}</span>
              <span>{isBengali ? "আর ৪ দিন বাকি" : "4 days left"}</span>
            </div>
          </div>

          {/* Quick Operations Matrix */}
          <div className="ultra-glass-card" style={{ padding: 20, flex: 1 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginBottom: 12 }}>
              {isBengali ? "কুইক অ্যাকশন শর্টকাট" : "Quick Operations"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Link href="/pos" className="glass-action-row">
                <div>
                  <strong style={{ fontSize: 12.5, color: "#7c3aed", display: "block" }}>
                    {isBengali ? "পিওএস কাউন্টার" : "POS Counter"}
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Hotkey: F8</span>
                </div>
                <IconPos size={14} color="#8b5cf6" />
              </Link>

              <Link href="/purchases/new" className="glass-action-row">
                <div>
                  <strong style={{ fontSize: 12.5, color: "var(--text-main)", display: "block" }}>
                    {isBengali ? "নতুন পারচেজ" : "Purchase PO"}
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Stock Inward</span>
                </div>
                <IconPurchases size={14} color="var(--text-muted)" />
              </Link>

              <button onClick={() => openDueSms()} className="glass-action-row" style={{ width: "100%", textAlign: "left" }}>
                <div>
                  <strong style={{ fontSize: 12.5, color: "var(--danger-text)", display: "block" }}>
                    {isBengali ? "বাকি তাগাদা SMS" : "Due SMS Blast"}
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>1-Click SMS</span>
                </div>
                <IconSms size={14} color="var(--danger)" />
              </button>

              <Link href="/expenses" className="glass-action-row">
                <div>
                  <strong style={{ fontSize: 12.5, color: "var(--text-main)", display: "block" }}>
                    {isBengali ? "দৈনন্দিন খরচ" : "Expense Entry"}
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Petty Cash</span>
                </div>
                <IconExpenses size={14} color="var(--text-muted)" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Actionable Alerts Hub (কোথায় সমস্যা? — 3-Tab Risk Hub) */}
      <div className="ultra-glass-card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
              {isBengali ? "🚨 অ্যাকশনেবল ব্যবসায়িক অ্যালার্ট (Where is the problem?)" : "🚨 Actionable Business Risk Alerts"}
            </h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {isBengali ? "মালিক হিসেবে যেসব জায়গায় আজই ব্যবস্থা নেওয়া দরকার" : "Bottlenecks requiring immediate owner attention"}
            </span>
          </div>

          {/* Glass Alert Tabs */}
          <div className="glass-segmented">
            <button
              type="button"
              onClick={() => setAlertTab("INVENTORY")}
              className={`glass-segmented-btn ${alertTab === "INVENTORY" ? "active" : ""}`}
            >
              ⚠️ {isBengali ? "লো-স্টক ও মেয়াদ (5)" : "Stock & Expiry (5)"}
            </button>
            <button
              type="button"
              onClick={() => setAlertTab("OVERDUE_CUSTOMERS")}
              className={`glass-segmented-btn ${alertTab === "OVERDUE_CUSTOMERS" ? "active" : ""}`}
            >
              👥 {isBengali ? "বাকি কাস্টমার (2)" : "Overdue Dues (2)"}
            </button>
            <button
              type="button"
              onClick={() => setAlertTab("SUPPLIER_PAYABLES")}
              className={`glass-segmented-btn ${alertTab === "SUPPLIER_PAYABLES" ? "active" : ""}`}
            >
              🏭 {isBengali ? "সাপ্লায়ার দেনা (2)" : "Supplier Payables (2)"}
            </button>
          </div>
        </div>

        {/* Tab 1: Inventory & Near-Expiry */}
        {alertTab === "INVENTORY" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Low Stock Watchlist */}
            <div style={{ background: "rgba(248, 250, 252, 0.75)", backdropFilter: "blur(12px)", padding: 16, borderRadius: 12, border: "1px solid rgba(226, 232, 240, 0.8)", borderTop: "1.5px solid rgba(255, 255, 255, 0.95)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <strong style={{ fontSize: 13, color: "var(--warning-text)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>⚠️</span>
                  {isBengali ? "লো-স্টক পণ্য (Reorder Needed)" : "Low Stock Reorder List"}
                </strong>
                <Link href="/inventory" style={{ fontSize: 11.5, color: "var(--primary)", fontWeight: 700 }}>
                  {isBengali ? "ইনভেন্টরি →" : "Inventory →"}
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lowStockItems.map((item) => (
                  <div key={item.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.9)", boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)" }}>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, display: "block", color: "var(--text-main)" }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Reorder level: {item.reorderLevel} {item.unit}</span>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--danger)" }}>{item.currentStock} {item.unit}</span>
                      <Link href="/purchases/new" className="btn-glass-item" style={{ padding: "4px 9px", fontSize: 11, fontWeight: 800, color: "var(--primary-dark)" }}>
                        + PO
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Near Expiry Items */}
            <div style={{ background: "rgba(248, 250, 252, 0.75)", backdropFilter: "blur(12px)", padding: 16, borderRadius: 12, border: "1px solid rgba(226, 232, 240, 0.8)", borderTop: "1.5px solid rgba(255, 255, 255, 0.95)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <strong style={{ fontSize: 13, color: "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>⏳</span>
                  {isBengali ? "দ্রুত মেয়াদোত্তীর্ণ পণ্য (Near Expiry)" : "Near Expiry Items (< 30 Days)"}
                </strong>
                <Link href="/products/special-addons" style={{ fontSize: 11.5, color: "var(--primary)", fontWeight: 700 }}>
                  {isBengali ? "ব্যাচ ট্র্যাকার →" : "Batch Tracker →"}
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {nearExpiryItems.map((item) => (
                  <div key={item.sku} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.9)", boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)" }}>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, display: "block", color: "var(--text-main)" }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Batch: {item.batch} • Stock: {item.stock}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="badge badge-danger" style={{ fontSize: 10.5, marginBottom: 2 }}>{item.daysLeft} {isBengali ? "দিন বাকি" : "days left"}</span>
                      <span style={{ fontSize: 10.5, color: "var(--primary)", display: "block", fontWeight: 800 }}>{item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Overdue Customers */}
        {alertTab === "OVERDUE_CUSTOMERS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {overdueCustomers.map((cust) => (
              <div key={cust.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.9)", borderTop: "1.5px solid rgba(255, 255, 255, 1)", boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)" }}>
                <div>
                  <strong style={{ fontSize: 13.5, color: "var(--text-main)", display: "block" }}>{cust.name}</strong>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>📱 {cust.phone} • #{cust.invoice} • <span style={{ color: "var(--danger)", fontWeight: 700 }}>{cust.daysOverdue} {isBengali ? "দিন ধরে বকেয়া" : "days overdue"}</span></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <strong style={{ fontSize: 16, color: "var(--danger)", fontWeight: 800 }}>{formatCurrency(cust.due)}</strong>
                  <button
                    onClick={() => openDueSms({ id: cust.id, name: cust.name, phone: cust.phone, dueAmount: cust.due, lastInvoice: cust.invoice })}
                    className="btn-glass-sms"
                    style={{ padding: "5px 12px", fontSize: 12 }}
                  >
                    <IconSms size={13} />
                    <span>{isBengali ? "তাগাদা SMS" : "Send SMS"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Supplier Payables */}
        {alertTab === "SUPPLIER_PAYABLES" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {supplierPayables.map((sup) => (
              <div key={sup.invoice} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.9)", borderTop: "1.5px solid rgba(255, 255, 255, 1)", boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)" }}>
                <div>
                  <strong style={{ fontSize: 13.5, color: "var(--text-main)", display: "block" }}>{sup.name}</strong>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>চালান নম্বর: #{sup.invoice} • <span style={{ color: sup.urgent ? "var(--danger)" : "var(--warning-text)", fontWeight: 700 }}>{sup.dueDate}</span></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <strong style={{ fontSize: 16, color: "var(--text-main)", fontWeight: 800 }}>{formatCurrency(sup.amount)}</strong>
                  <Link href="/suppliers" className="btn-glass-item" style={{ padding: "6px 14px", fontSize: 12 }}>
                    {isBengali ? "পেমেন্ট এন্ট্রি" : "Record Payment"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Live Feed & Performance Insights (55% / 45%) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 20 }}>
        {/* Left: Recent Invoices & Staff Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Recent Invoices Table */}
          <div className="ultra-glass-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {isBengali ? "সর্বশেষ বিক্রয় রসিদ (Live Transactions)" : "Live Sales Transactions"}
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isBengali ? "আজকের রিয়েল-টাইম কাউন্টার সেলস" : "Today's POS orders"}
                </span>
              </div>
              <Link href="/sales" style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 700 }}>
                {isBengali ? "সব দেখুন →" : "View all →"}
              </Link>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>{isBengali ? "ইনভয়েস" : "Invoice"}</th>
                    <th>{isBengali ? "কাস্টমার" : "Customer"}</th>
                    <th>{isBengali ? "ক্যাশিয়ার" : "Staff"}</th>
                    <th>{isBengali ? "পরিমাণ" : "Amount"}</th>
                    <th>{isBengali ? "মাধ্যম" : "Method"}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.invoice}>
                      <td>
                        <strong style={{ color: "var(--primary)", fontSize: 13 }}>{sale.invoice}</strong>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sale.time}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: 13, display: "block" }}>{sale.customer}</strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sale.phone}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sale.cashier}</span>
                      </td>
                      <td>
                        <strong style={{ fontSize: 13.5 }}>{formatCurrency(sale.amount)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            sale.status === "PAID" ? "badge-success" : "badge-danger"
                          }`}
                        >
                          {sale.method}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff Accountability Log */}
          <div className="ultra-glass-card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
              {isBengali ? "কর্মচারী অ্যাক্টিভিটি লগ (Accountability)" : "Staff Activity Log"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {staffActivity.map((log, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "7px 0", borderBottom: idx < staffActivity.length - 1 ? "1px solid rgba(226, 232, 240, 0.6)" : "none" }}>
                  <div>
                    <strong style={{ color: "var(--text-main)" }}>{log.staff}</strong>
                    <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>{isBengali ? log.actionBn : log.actionEn}</span>
                  </div>
                  <span style={{ color: "var(--text-subtle)", whiteSpace: "nowrap" }}>{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Top 5 Best Selling Products & Staff Performance */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top 5 Best Sellers */}
          <div className="ultra-glass-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {isBengali ? "টপ সেলিং প্রোডাক্টস (Top 5 Best Sellers)" : "Top 5 Best Selling Products"}
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isBengali ? "সর্বাধিক বিক্রিত আইটেম ও মুনাফা" : "Highest volume & revenue drivers"}
                </span>
              </div>
              <Link href="/products" style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 700 }}>
                {isBengali ? "ক্যাটালগ →" : "Catalog →"}
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bestSellers.map((item, idx) => (
                <div
                  key={item.sku}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "rgba(248, 250, 252, 0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 10,
                    border: "1px solid rgba(226, 232, 240, 0.85)",
                    borderTop: "1.5px solid rgba(255, 255, 255, 0.95)",
                    transition: "all 0.18s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: idx === 0 ? "var(--aurora-gradient)" : "rgba(226, 232, 240, 0.9)", color: idx === 0 ? "#fff" : "#475569", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, boxShadow: idx === 0 ? "var(--aurora-glow)" : "none" }}>
                      {idx + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: 12.5, color: "var(--text-main)", display: "block" }}>{item.name}</strong>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.unitsSold} {isBengali ? "টি বিক্রয়" : "units sold"} • Margin: {item.margin}</span>
                    </div>
                  </div>
                  <strong style={{ fontSize: 13.5, color: "var(--primary-dark)", fontWeight: 800 }}>
                    {formatCurrency(item.revenue)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Cashiers / Staff */}
          <div className="ultra-glass-card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
              {isBengali ? "স্টাফ পারফরম্যান্স স্ন্যাপশট" : "Staff Performance Snapshot"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(248, 250, 252, 0.8)", backdropFilter: "blur(10px)", padding: 14, borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.85)", borderTop: "1.5px solid rgba(255, 255, 255, 0.95)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Tanvir Ahmed</div>
                <strong style={{ fontSize: 18, color: "var(--primary)", fontWeight: 800, display: "block", marginTop: 2 }}>{formatCurrency(28400)}</strong>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>১৮টি ইনভয়েস (৬৩%)</div>
              </div>
              <div style={{ background: "rgba(248, 250, 252, 0.8)", backdropFilter: "blur(10px)", padding: 14, borderRadius: 10, border: "1px solid rgba(226, 232, 240, 0.85)", borderTop: "1.5px solid rgba(255, 255, 255, 0.95)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Sumon Mia</div>
                <strong style={{ fontSize: 18, color: "var(--success-text)", fontWeight: 800, display: "block", marginTop: 2 }}>{formatCurrency(20250)}</strong>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>১৪টি ইনভয়েস (৩৭%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Due SMS Modal */}
      <QuickDueSmsModal
        isOpen={isDueSmsModalOpen}
        onClose={() => setIsDueSmsModalOpen(false)}
        customer={selectedDueCustomer}
      />
    </main>
  );
}
