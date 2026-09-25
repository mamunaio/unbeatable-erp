"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

type DiscountType = "PERCENTAGE" | "FLAT" | "BOGO" | "VIP_TIER";

interface PromotionCoupon {
  id: string;
  title: string;
  code: string;
  type: DiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountCap?: number;
  targetCategory?: string;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  timesRedeemed: number;
  totalDiscountGiven: number;
  status: "ACTIVE" | "EXPIRED" | "PAUSED";
}

const initialCoupons: PromotionCoupon[] = [
  {
    id: "promo-1",
    title: "ঈদুল ফিতর মেগা ডিসকাউন্ট",
    code: "EID2026",
    type: "PERCENTAGE",
    discountValue: 15,
    minPurchaseAmount: 2000,
    maxDiscountCap: 500,
    startDate: "2026-09-01",
    expiryDate: "2026-10-31",
    usageLimit: 500,
    timesRedeemed: 142,
    totalDiscountGiven: 56800,
    status: "ACTIVE",
  },
  {
    id: "promo-2",
    title: "নতুন কাস্টমার ওয়েলকাম অফার",
    code: "WELCOME100",
    type: "FLAT",
    discountValue: 100,
    minPurchaseAmount: 1000,
    startDate: "2026-08-01",
    expiryDate: "2026-12-31",
    usageLimit: 1000,
    timesRedeemed: 320,
    totalDiscountGiven: 32000,
    status: "ACTIVE",
  },
  {
    id: "promo-3",
    title: "কসমেটিকস ও স্কিনকেয়ার স্পেশাল",
    code: "BEAUTY20",
    type: "PERCENTAGE",
    discountValue: 20,
    minPurchaseAmount: 1500,
    maxDiscountCap: 400,
    targetCategory: "Personal Care",
    startDate: "2026-09-15",
    expiryDate: "2026-10-15",
    usageLimit: 200,
    timesRedeemed: 68,
    totalDiscountGiven: 20400,
    status: "ACTIVE",
  },
  {
    id: "promo-4",
    title: "লাক্স সাবান ২ কিনলে ১ ফ্রি",
    code: "BOGO-LUX",
    type: "BOGO",
    discountValue: 100, // 100% of 1 item
    minPurchaseAmount: 130,
    targetCategory: "Personal Care",
    startDate: "2026-09-20",
    expiryDate: "2026-10-05",
    usageLimit: 150,
    timesRedeemed: 45,
    totalDiscountGiven: 2925,
    status: "ACTIVE",
  },
  {
    id: "promo-5",
    title: "গোল্ড ভিআইপি মেম্বার ডিসকাউন্ট",
    code: "VIPGOLD",
    type: "VIP_TIER",
    discountValue: 5,
    minPurchaseAmount: 0,
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    usageLimit: 9999,
    timesRedeemed: 410,
    totalDiscountGiven: 48500,
    status: "ACTIVE",
  },
];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<"COUPONS" | "SANDBOX" | "LOYALTY">("COUPONS");
  const [coupons, setCoupons] = useState<PromotionCoupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromo, setNewPromo] = useState({
    title: "",
    code: "",
    type: "PERCENTAGE" as DiscountType,
    discountValue: 10,
    minPurchaseAmount: 1000,
    maxDiscountCap: 500,
    targetCategory: "ALL",
    startDate: "2026-09-25",
    expiryDate: "2026-10-31",
    usageLimit: 200,
  });

  // Interactive Sandbox Simulator State
  const [testCode, setTestCode] = useState("EID2026");
  const [testSubtotal, setTestSubtotal] = useState<number>(3200);

  // Filtered List
  const filteredCoupons = coupons.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "ALL" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  // Calculate Aggregates
  const totalActivePromos = coupons.filter((c) => c.status === "ACTIVE").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.timesRedeemed, 0);
  const totalDiscountDisbursed = coupons.reduce((sum, c) => sum + c.totalDiscountGiven, 0);
  const estimatedDrivenSales = totalDiscountDisbursed * 7.5; // Roughly 7.5x ROI

  // Handle Add New Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.title || !newPromo.code) {
      alert("অনুগ্রহ করে ক্যাম্পেইনের নাম এবং কুপন কোড প্রদান করুন!");
      return;
    }

    const created: PromotionCoupon = {
      id: `promo-${Date.now()}`,
      title: newPromo.title,
      code: newPromo.code.toUpperCase().trim(),
      type: newPromo.type,
      discountValue: Number(newPromo.discountValue),
      minPurchaseAmount: Number(newPromo.minPurchaseAmount) || 0,
      maxDiscountCap: newPromo.maxDiscountCap ? Number(newPromo.maxDiscountCap) : undefined,
      targetCategory: newPromo.targetCategory === "ALL" ? undefined : newPromo.targetCategory,
      startDate: newPromo.startDate,
      expiryDate: newPromo.expiryDate,
      usageLimit: Number(newPromo.usageLimit) || 100,
      timesRedeemed: 0,
      totalDiscountGiven: 0,
      status: "ACTIVE",
    };

    setCoupons([created, ...coupons]);
    setShowCreateModal(false);
    setNewPromo({
      title: "",
      code: "",
      type: "PERCENTAGE",
      discountValue: 10,
      minPurchaseAmount: 1000,
      maxDiscountCap: 500,
      targetCategory: "ALL",
      startDate: "2026-09-25",
      expiryDate: "2026-10-31",
      usageLimit: 200,
    });
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Export CSV
  const handleExportCsv = () => {
    exportToCsv({
      filename: "Coupons_and_Promotions_Report",
      headers: [
        { key: "code", label: "Coupon Promo Code" },
        { key: "title", label: "Campaign Title" },
        { key: "type", label: "Discount Type" },
        { key: "discountValue", label: "Discount Rate / Value" },
        { key: "minPurchaseAmount", label: "Min Spend (BDT)" },
        { key: "maxDiscountCap", label: "Max Cap (BDT)" },
        { key: "timesRedeemed", label: "Total Redemptions" },
        { key: "totalDiscountGiven", label: "Total Discount Disbursed (BDT)" },
        { key: "expiryDate", label: "Expiry Date" },
        { key: "status", label: "Status" },
      ],
      data: filteredCoupons,
    });
  };

  // Sandbox Live Evaluation
  const evaluatedPromo = coupons.find((c) => c.code.toUpperCase() === testCode.trim().toUpperCase());
  let calcDiscount = 0;
  let validationMessage = "";
  let isValid = false;

  if (!evaluatedPromo) {
    validationMessage = "❌ কুপন কোডটি খুঁজে পাওয়া যায়নি!";
  } else if (evaluatedPromo.status !== "ACTIVE") {
    validationMessage = "⚠️ কুপনটি বর্তমানে স্থগিত বা নিষ্ক্রিয়!";
  } else if (testSubtotal < evaluatedPromo.minPurchaseAmount) {
    validationMessage = `⚠️ ন্যূনতম কেনাকাটার শর্ত পূরণ হয়নি! (ন্যূনতম ৳${evaluatedPromo.minPurchaseAmount} প্রয়োজন)`;
  } else {
    isValid = true;
    if (evaluatedPromo.type === "PERCENTAGE" || evaluatedPromo.type === "VIP_TIER") {
      const raw = (testSubtotal * evaluatedPromo.discountValue) / 100;
      calcDiscount = evaluatedPromo.maxDiscountCap ? Math.min(raw, evaluatedPromo.maxDiscountCap) : raw;
      validationMessage = `✓ ${evaluatedPromo.discountValue}% ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!`;
    } else if (evaluatedPromo.type === "FLAT") {
      calcDiscount = Math.min(evaluatedPromo.discountValue, testSubtotal);
      validationMessage = `✓ ৳${evaluatedPromo.discountValue} ফ্ল্যাট ছাড় সফলভাবে যুক্ত হয়েছে!`;
    } else if (evaluatedPromo.type === "BOGO") {
      calcDiscount = 65; // Example 1 free product price
      validationMessage = `✓ Buy 2 Get 1 Free অফার কার্যকর হয়েছে!`;
    }
  }

  const finalSimulatedBill = Math.max(0, testSubtotal - calcDiscount);

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🎟️ কুপন, ডিসকাউন্ট ও অফার ইঞ্জিন (Promotions & Campaigns)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            প্রমোকোড, উৎসবের অফার (ঈদ/বৈশাখ), ক্যাটাগরি ছাড়, BOGO এবং ভিআইপি মেম্বারশিপ টায়ার পরিচালনা।
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            ＋ নতুন কুপন অফার তৈরি করুন
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট সক্রিয় অফার ও কুপন</span>
          <div className="stat-card-value">{totalActivePromos}টি ক্যাম্পেইন</div>
          <div className="stat-card-sub">পিওএস কাউন্টারে সরাসরি ব্যবহারযোগ্য</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">কুপন রিডিম সংখ্যা</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {totalRedemptions} বার
          </div>
          <div className="stat-card-sub">কাস্টমারদের দ্বারা সফল ব্যবহার</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">মোট প্রদত্ত ছাড় (Discounts)</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(totalDiscountDisbursed)}
          </div>
          <div className="stat-card-sub">কাস্টমারদের সেভিংস বেনিফিট</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">ক্যাম্পেইনের মাধ্যমে অর্জিত সেলস</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(estimatedDrivenSales)}
          </div>
          <div className="stat-card-sub">আনুমানিক ৭.৫ গুণ সেলস রিটার্ন (ROI)</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid var(--border-color)", paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab("COUPONS")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "COUPONS" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "COUPONS" ? "#fff" : "var(--text-main)",
          }}
        >
          🎟️ সকল কুপন ও ক্যাম্পেইন তালিকা ({filteredCoupons.length})
        </button>

        <button
          onClick={() => setActiveTab("SANDBOX")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "SANDBOX" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "SANDBOX" ? "#fff" : "var(--text-main)",
          }}
        >
          ⚡ লাইভ পিওএস কুপন সিমুলেটর (Discount Calculator)
        </button>

        <button
          onClick={() => setActiveTab("LOYALTY")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "LOYALTY" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "LOYALTY" ? "#fff" : "var(--text-main)",
          }}
        >
          🎁 লয়্যালটি পয়েন্ট ও মেম্বারশিপ টায়ার (VIP CRM)
        </button>
      </div>

      {/* TAB 1: ALL COUPONS LIST */}
      {activeTab === "COUPONS" && (
        <div>
          {/* Search & Filter Bar */}
          <div className="card" style={{ marginBottom: 20, padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 ক্যাম্পেইনের নাম বা কুপন কোড (যেমন: EID2026) দিয়ে খুঁজুন..."
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  fontSize: 13,
                }}
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <option value="ALL">সকল অফারের ধরন (All Types)</option>
                <option value="PERCENTAGE">শতাংশ ছাড় (Percentage %)</option>
                <option value="FLAT">ফ্ল্যাট ক্যাশ ছাড় (Flat ৳)</option>
                <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
                <option value="VIP_TIER">ভিআইপি মেম্বারশিপ (VIP Tier)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কুপন কোড</th>
                  <th>ক্যাম্পেইনের নাম</th>
                  <th>অফারের বিবরণ</th>
                  <th>ন্যূনতম কেনাকাটা</th>
                  <th>সর্বোচ্চ ছাড় ক্যাপ</th>
                  <th>মেয়াদকাল</th>
                  <th>ব্যবহার সংখ্যা</th>
                  <th>মোট ছাড় দেওয়া</th>
                  <th>স্ট্যাটাস</th>
                  <th style={{ textAlign: "right" }}>একশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 800,
                          fontSize: 14,
                          background: "var(--primary-light)",
                          color: "var(--primary-dark)",
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: "1px dashed var(--primary)",
                        }}
                      >
                        {c.code}
                      </span>
                    </td>
                    <td>
                      <strong>{c.title}</strong>
                      {c.targetCategory && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>
                          ক্যাটাগরি: {c.targetCategory}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {c.type === "PERCENTAGE"
                          ? `${c.discountValue}% ছাড়`
                          : c.type === "FLAT"
                          ? `৳${c.discountValue} ফ্ল্যাট`
                          : c.type === "BOGO"
                          ? "Buy 2 Get 1 Free"
                          : `${c.discountValue}% VIP`}
                      </span>
                    </td>
                    <td>
                      {c.minPurchaseAmount > 0 ? (
                        <strong>{formatCurrency(c.minPurchaseAmount)}</strong>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>যে কোনো পরিমাণ</span>
                      )}
                    </td>
                    <td>
                      {c.maxDiscountCap ? (
                        formatCurrency(c.maxDiscountCap)
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>সীমাহীন</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {formatDate(c.startDate)} হতে {formatDate(c.expiryDate)}
                    </td>
                    <td>
                      <strong>{c.timesRedeemed}</strong> / {c.usageLimit}
                    </td>
                    <td>
                      <strong style={{ color: "var(--danger)" }}>{formatCurrency(c.totalDiscountGiven)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${c.status === "ACTIVE" ? "badge-success" : "badge-neutral"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className="btn-secondary"
                        style={{ padding: "4px 8px", fontSize: 11 }}
                      >
                        {c.status === "ACTIVE" ? "Pause" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SANDBOX SIMULATOR */}
      {activeTab === "SANDBOX" && (
        <div>
          <div className="card" style={{ marginBottom: 24, background: "var(--bg-subtle)", border: "1.5px solid var(--border-color)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>⚡ লাইভ কুপন ডিসকাউন্ট ক্যালকুলেটর (POS Test Sandbox)</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              পিওএস কাউন্টারে কাস্টমারের বিলে কোনো কুপন কোড প্রয়োগ করলে কত ছাড় হবে তা তাৎক্ষণিক টেস্ট করে দেখুন।
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Input Side */}
              <div style={{ background: "#ffffff", padding: 18, borderRadius: 8, border: "1px solid var(--border-color)" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    টেস্ট কুপন কোড ইনপুট করুন:
                  </label>
                  <input
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                    placeholder="যেমন: EID2026, WELCOME100, BEAUTY20"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "2px solid var(--primary)",
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: 16,
                      textTransform: "uppercase",
                    }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {coupons.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setTestCode(c.code)}
                        className="btn-secondary"
                        style={{ padding: "2px 8px", fontSize: 11, fontFamily: "monospace" }}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                    কার্ট সাব-টোটাল বিল (Cart Subtotal ৳):
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={testSubtotal}
                    onChange={(e) => setTestSubtotal(Number(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "1px solid var(--border-color)",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  />
                </div>
              </div>

              {/* Output Evaluation Side */}
              <div
                style={{
                  background: isValid ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
                  padding: 18,
                  borderRadius: 8,
                  border: `1.5px solid ${isValid ? "var(--success)" : "var(--danger)"}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>ভ্যালিডেশন ফলাফল:</span>
                    <span className={`badge ${isValid ? "badge-success" : "badge-danger"}`}>
                      {isValid ? "COUPON APPLIED" : "INVALID"}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isValid ? "var(--success)" : "var(--danger)", marginBottom: 14 }}>
                    {validationMessage}
                  </div>

                  <div style={{ fontSize: 13, lineHeight: 1.6, borderTop: "1px dashed var(--border-color)", paddingTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>মূল কার্ট মূল্য:</span>
                      <strong>{formatCurrency(testSubtotal)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                      <span>প্রযোজ্য কুপন ছাড়:</span>
                      <strong>- {formatCurrency(calcDiscount)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border-color)", marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>চূড়ান্ত প্রদেয় মূল্য:</span>
                  <strong style={{ fontSize: 22, color: "var(--primary-dark)" }}>{formatCurrency(finalSimulatedBill)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOYALTY POINTS & VIP CRM */}
      {activeTab === "LOYALTY" && (
        <div style={{ maxWidth: 880 }}>
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🎁 কাস্টমার লয়্যালটি রিওয়ার্ডস ও ভিআইপি টায়ার</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              কাস্টমারদের প্রতি ১০০ টাকা কেনাকাটায় রিওয়ার্ড পয়েন্ট এবং নির্দিষ্ট মেম্বারশিপ টায়ার অফার নির্ধারণ।
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <span className="badge badge-neutral" style={{ fontWeight: 800, marginBottom: 8 }}>🥉 সিলভার মেম্বার</span>
                <div style={{ fontSize: 13, marginTop: 6 }}>
                  <div>মোট ক্রয়: <b>৳১০,০০০+</b></div>
                  <div>রিওয়ার্ড: <b>১% ক্যাশব্যাক পয়েন্ট</b></div>
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 8, border: "1px solid #fef08a", background: "#fefce8" }}>
                <span className="badge badge-warning" style={{ fontWeight: 800, marginBottom: 8 }}>🥈 গোল্ড মেম্বার</span>
                <div style={{ fontSize: 13, marginTop: 6 }}>
                  <div>মোট ক্রয়: <b>৳২৫,০০০+</b></div>
                  <div>রিওয়ার্ড: <b>৩% ক্যাশব্যাক + বিশেষ ছাড়</b></div>
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 8, border: "1px solid #fed7aa", background: "#fff7ed" }}>
                <span className="badge badge-primary" style={{ fontWeight: 800, marginBottom: 8 }}>🥇 প্লাটিনাম ভিআইপি</span>
                <div style={{ fontSize: 13, marginTop: 6 }}>
                  <div>মোট ক্রয়: <b>৳৫০,০০০+</b></div>
                  <div>রিওয়ার্ড: <b>৫% ফ্ল্যাট ছাড় + ফ্রি হোম ডেলিভারি</b></div>
                </div>
              </div>
            </div>

            <div style={{ padding: 14, background: "var(--primary-light)", borderRadius: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-dark)" }}>
                💡 অটো-পয়েন্ট কনফিগারেশন: প্রতি ১০০ টাকা কেনাকাটায় ১ পয়েন্ট (১ পয়েন্ট = ১ টাকা)।
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW PROMOTION COUPON */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🎟️ নতুন কুপন / ডিসকাউন্ট ক্যাম্পেইন তৈরি করুন</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ক্যাম্পেইনের নাম / শিরোনাম *</label>
                <input
                  required
                  placeholder="যেমন: পহেলা বৈশাখ স্পেশাল ডিসকাউন্ট"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>কুপন প্রোমো কোড *</label>
                  <input
                    required
                    placeholder="যেমন: BOISHAKH26"
                    value={newPromo.code}
                    onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>অফারের ধরন (Type)</label>
                  <select
                    value={newPromo.type}
                    onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value as DiscountType })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                  >
                    <option value="PERCENTAGE">শতাংশ ছাড় (Percentage %)</option>
                    <option value="FLAT">ফ্ল্যাট ক্যাশ ছাড় (Flat Amount ৳)</option>
                    <option value="BOGO">Buy 1 Get 1 (BOGO Free)</option>
                    <option value="VIP_TIER">ভিআইপি টায়ার ছাড় (VIP Tier)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ছাড়ের মান (% বা ৳) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPromo.discountValue}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ন্যূনতম ক্রয় (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPromo.minPurchaseAmount}
                    onChange={(e) => setNewPromo({ ...newPromo, minPurchaseAmount: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সর্বোচ্চ ক্যাপ (৳)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={newPromo.maxDiscountCap}
                    onChange={(e) => setNewPromo({ ...newPromo, maxDiscountCap: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>শুরুর তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={newPromo.startDate}
                    onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মেয়াদোত্তীর্ণের তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={newPromo.expiryDate}
                    onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মোট ব্যবহারের সর্বোচ্চ সীমা (Usage Limit)</label>
                <input
                  type="number"
                  min="1"
                  value={newPromo.usageLimit}
                  onChange={(e) => setNewPromo({ ...newPromo, usageLimit: Number(e.target.value) || 100 })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  🚀 ক্যাম্পেইন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
