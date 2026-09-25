"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

export type DamageReason =
  | "EXPIRED"
  | "BROKEN_DAMAGED"
  | "LEAKAGE_SPOILAGE"
  | "RODENT_PEST"
  | "INVENTORY_SHORTAGE";

export type DisposalAction =
  | "SCRAPPED"
  | "SUPPLIER_CLAIM"
  | "CLEARANCE_DISCOUNT"
  | "DONATION";

export interface DamageEntry {
  id: string;
  voucherNo: string;
  date: string;
  productName: string;
  sku: string;
  batchNo?: string;
  category: string;
  quantity: number;
  unit: string;
  costPrice: number;
  totalLoss: number;
  reason: DamageReason;
  disposalAction: DisposalAction;
  branch: string;
  recordedBy: string;
  supplierName?: string;
  claimRecovered?: number;
  notes: string;
}

const initialDamageRecords: DamageEntry[] = [
  {
    id: "dmg-1",
    voucherNo: "DMG-2026-081",
    date: "2026-09-25T11:45:00",
    productName: "Aarong Fresh Milk 1 Litre",
    sku: "MILK-AAR-1L",
    batchNo: "B-2609-01",
    category: "Dairy & Beverage",
    quantity: 4,
    unit: "Pcs",
    costPrice: 92,
    totalLoss: 368,
    reason: "EXPIRED",
    disposalAction: "SUPPLIER_CLAIM",
    branch: "Main Branch",
    recordedBy: "Stock Keeper - Faruk",
    supplierName: "BRAC Dairy Ltd",
    claimRecovered: 368,
    notes: "ফ্রিজ কম্প্রেসার ট্রিপ করায় মেয়াদ শেষ হওয়ার আগে প্যাকেট ফুলে গিয়ে নষ্ট হয়েছে। সাপ্লায়ার ক্রেডিট ক্লেইম পাঠানো হয়েছে।",
  },
  {
    id: "dmg-2",
    voucherNo: "DMG-2026-080",
    date: "2026-09-24T16:20:00",
    productName: "Rupchanda Soyabean Oil 5L",
    sku: "OIL-RUP-5L",
    batchNo: "LOT-992",
    category: "Edible Oil & Ghee",
    quantity: 1,
    unit: "Can",
    costPrice: 890,
    totalLoss: 890,
    reason: "LEAKAGE_SPOILAGE",
    disposalAction: "SCRAPPED",
    branch: "Main Branch",
    recordedBy: "Admin",
    supplierName: "Bangladesh Edible Oil Ltd",
    notes: "আনলোডিং করার সময় ক্যানের নিচের অংশে ফুটো হয়ে তেল মেঝেতে পড়ে নষ্ট হয়েছে।",
  },
  {
    id: "dmg-3",
    voucherNo: "DMG-2026-079",
    date: "2026-09-22T14:10:00",
    productName: "Pran Potato Crackers 25g",
    sku: "SNK-PRAN-POT",
    batchNo: "B-8812",
    category: "Bakery & Snacks",
    quantity: 12,
    unit: "Packets",
    costPrice: 15,
    totalLoss: 180,
    reason: "RODENT_PEST",
    disposalAction: "SCRAPPED",
    branch: "Dhanmondi Branch",
    recordedBy: "Assistant - Rashed",
    notes: "ওয়্যারহাউজের নিচের সেলফে ইঁদুরের উপদ্রবে প্যাকেট কাটা অবস্থায় পাওয়া গেছে। পেস্ট কন্ট্রোল টিমকে ডাকা হয়েছে।",
  },
  {
    id: "dmg-4",
    voucherNo: "DMG-2026-078",
    date: "2026-09-18T10:00:00",
    productName: "Dano Full Cream Milk Powder 1kg",
    sku: "MILK-DAN-1KG",
    batchNo: "LOT-441",
    category: "Dairy & Beverage",
    quantity: 2,
    unit: "Foil Pack",
    costPrice: 850,
    totalLoss: 1700,
    reason: "BROKEN_DAMAGED",
    disposalAction: "CLEARANCE_DISCOUNT",
    branch: "Main Branch",
    recordedBy: "Manager - Tanvir",
    supplierName: "Arla Foods Bangladesh",
    claimRecovered: 1000,
    notes: "আউটার কার্টন ড্যামেজ হয়েছে, ভেতরের ফয়েল ঠিক থাকায় ৬০% ডিসকাউন্টে স্টাফদের মাঝে সেল করা হয়েছে।",
  },
  {
    id: "dmg-5",
    voucherNo: "DMG-2026-077",
    date: "2026-09-12T18:30:00",
    productName: "Fresh Fuji Apple China",
    sku: "FRUIT-APP-FUJ",
    category: "Fruits & Vegetables",
    quantity: 5.5,
    unit: "Kg",
    costPrice: 220,
    totalLoss: 1210,
    reason: "LEAKAGE_SPOILAGE",
    disposalAction: "SCRAPPED",
    branch: "Uttara Branch",
    recordedBy: "Supervisor - Kamal",
    notes: "কাঁচা ফলের ক্রাফটে দাগ পড়ে পচন ধরেছে। স্বাস্থ্যবিধি মেনে বাতিল করা হয়েছে।",
  },
];

const availableProductsMaster = [
  { name: "Miniket Premium Rice 25kg", sku: "RICE-MIN-25", unit: "Bag", costPrice: 1650, category: "Grains & Staples" },
  { name: "Rupchanda Soyabean Oil 5L", sku: "OIL-RUP-5L", unit: "Can", costPrice: 890, category: "Edible Oil & Ghee" },
  { name: "Aarong Fresh Milk 1 Litre", sku: "MILK-AAR-1L", unit: "Pcs", costPrice: 92, category: "Dairy & Beverage" },
  { name: "Dano Full Cream Milk Powder 1kg", sku: "MILK-DAN-1KG", unit: "Foil Pack", costPrice: 850, category: "Dairy & Beverage" },
  { name: "Pran Potato Crackers 25g", sku: "SNK-PRAN-POT", unit: "Packets", costPrice: 15, category: "Bakery & Snacks" },
  { name: "Fresh Fuji Apple China", sku: "FRUIT-APP-FUJ", unit: "Kg", costPrice: 220, category: "Fruits & Vegetables" },
  { name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", unit: "Pcs", costPrice: 58, category: "Cosmetics & Toiletries" },
  { name: "Teer Pure Mustard Oil 1 Litre", sku: "OIL-MUST-1L", unit: "Bottle", costPrice: 280, category: "Edible Oil & Ghee" },
];

export default function DamagesRegisterPage() {
  const [damages, setDamages] = useState<DamageEntry[]>(initialDamageRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState<string>("ALL");
  const [filterDisposal, setFilterDisposal] = useState<string>("ALL");
  const [filterBranch, setFilterBranch] = useState<string>("ALL");

  // New Damage Entry Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductSku, setSelectedProductSku] = useState(availableProductsMaster[0].sku);
  const [entryQty, setEntryQty] = useState<string>("1");
  const [entryCostPrice, setEntryCostPrice] = useState<number>(availableProductsMaster[0].costPrice);
  const [entryReason, setEntryReason] = useState<DamageReason>("EXPIRED");
  const [entryDisposal, setEntryDisposal] = useState<DisposalAction>("SCRAPPED");
  const [entryBatch, setEntryBatch] = useState("");
  const [entryBranch, setEntryBranch] = useState("Main Branch");
  const [entrySupplier, setEntrySupplier] = useState("");
  const [entryClaimRecovered, setEntryClaimRecovered] = useState<string>("0");
  const [entryNotes, setEntryNotes] = useState("");

  // Slip Modal
  const [slipEntry, setSlipEntry] = useState<DamageEntry | null>(null);

  // Handle Product Selection Change
  const handleProductChange = (sku: string) => {
    setSelectedProductSku(sku);
    const prod = availableProductsMaster.find((p) => p.sku === sku);
    if (prod) {
      setEntryCostPrice(prod.costPrice);
    }
  };

  const handleCreateDamageEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = availableProductsMaster.find((p) => p.sku === selectedProductSku);
    if (!prod) return;

    const qtyNum = parseFloat(entryQty) || 1;
    const costNum = entryCostPrice || 0;
    const totalLossVal = qtyNum * costNum;
    const voucher = `DMG-2026-0${damages.length + 82}`;

    const newRecord: DamageEntry = {
      id: `dmg-${Date.now()}`,
      voucherNo: voucher,
      date: new Date().toISOString(),
      productName: prod.name,
      sku: prod.sku,
      batchNo: entryBatch || undefined,
      category: prod.category,
      quantity: qtyNum,
      unit: prod.unit,
      costPrice: costNum,
      totalLoss: totalLossVal,
      reason: entryReason,
      disposalAction: entryDisposal,
      branch: entryBranch,
      recordedBy: "Admin",
      supplierName: entrySupplier || undefined,
      claimRecovered: parseFloat(entryClaimRecovered) || 0,
      notes: entryNotes,
    };

    setDamages([newRecord, ...damages]);
    setIsAddModalOpen(false);

    // Reset Form
    setEntryQty("1");
    setEntryBatch("");
    setEntrySupplier("");
    setEntryClaimRecovered("0");
    setEntryNotes("");
  };

  // Filtered List
  const filteredDamages = damages.filter((item) => {
    const matchSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchReason = filterReason === "ALL" || item.reason === filterReason;
    const matchDisposal = filterDisposal === "ALL" || item.disposalAction === filterDisposal;
    const matchBranch = filterBranch === "ALL" || item.branch === filterBranch;

    return matchSearch && matchReason && matchDisposal && matchBranch;
  });

  // KPI Calculations
  const totalLossSum = damages.reduce((acc, d) => acc + d.totalLoss, 0);
  const totalClaimRecovered = damages.reduce((acc, d) => acc + (d.claimRecovered || 0), 0);
  const netFinancialLoss = Math.max(0, totalLossSum - totalClaimRecovered);
  const totalQuantityWrittenOff = damages.reduce((acc, d) => acc + d.quantity, 0);

  const getReasonBadge = (reason: DamageReason) => {
    switch (reason) {
      case "EXPIRED":
        return <span className="badge badge-danger">⏰ মেয়াদোত্তীর্ণ (Expired)</span>;
      case "BROKEN_DAMAGED":
        return <span className="badge" style={{ background: "#fee2e2", color: "#991b1b" }}>💥 ভাঙা / নষ্ট</span>;
      case "LEAKAGE_SPOILAGE":
        return <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}>💧 লিক / পচন</span>;
      case "RODENT_PEST":
        return <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>🐀 ইঁদুর / পোকার ক্ষতি</span>;
      case "INVENTORY_SHORTAGE":
        return <span className="badge" style={{ background: "#e0e7ff", color: "#3730a3" }}>📉 অডিট ঘাটতি</span>;
    }
  };

  const getDisposalBadge = (action: DisposalAction) => {
    switch (action) {
      case "SCRAPPED":
        return <span className="badge badge-neutral">🗑️ ফেলে দেওয়া হয়েছে</span>;
      case "SUPPLIER_CLAIM":
        return <span className="badge badge-success">🚚 সাপ্লায়ার ক্লেইম</span>;
      case "CLEARANCE_DISCOUNT":
        return <span className="badge badge-warning">🏷️ ডিসকাউন্টে ক্লিয়ারেন্স</span>;
      case "DONATION":
        return <span className="badge badge-primary">🤲 দান করা হয়েছে</span>;
    }
  };

  const handleExport = () => {
    exportToCsv({
      filename: "Damages_and_Wastage_Register",
      headers: [
        { key: "voucherNo", label: "Voucher No" },
        { key: "date", label: "Date" },
        { key: "productName", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "quantity", label: "Quantity" },
        { key: "unit", label: "Unit" },
        { key: "costPrice", label: "Cost Price (BDT)" },
        { key: "totalLoss", label: "Total Loss (BDT)" },
        { key: "reason", label: "Damage Reason" },
        { key: "disposalAction", label: "Disposal Action" },
        { key: "branch", label: "Branch" },
        { key: "recordedBy", label: "Recorded By" },
        { key: "claimRecovered", label: "Claim Recovered" },
        { key: "notes", label: "Notes" },
      ],
      data: filteredDamages,
    });
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/inventory" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
              ← স্টক লেজার
            </Link>
            <span style={{ color: "var(--border-color)" }}>/</span>
            <span style={{ fontSize: 13, color: "var(--primary-dark)", fontWeight: 700 }}>ড্যামেজ রেজিস্টার</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🗑️ ড্যামেজ, মেয়াদোত্তীর্ণ ও অপচয় রেজিস্টার</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            মেয়াদোত্তীর্ণ পণ্য, ভাঙা বা নষ্ট আইটেম ও স্টক অপচয় ট্র্যাকিং, ক্ষতিপূরণ ও ইনভেন্টরি রাইট-অফ।
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleExport} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨️ প্রিন্ট খাতা
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            ＋ নতুন ড্যামেজ এন্ট্রি করুন
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--danger)" }}>
          <span className="stat-card-title">সর্বমোট ড্যামেজ ও অপচয় ক্ষতি</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(totalLossSum)}
          </div>
          <div className="stat-card-sub">ক্রয়মূল্যের ভিত্তিতে হিসাবকৃত মোট অপচয়</div>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--success)" }}>
          <span className="stat-card-title">সাপ্লায়ার ক্লেইম / রিকভারি</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(totalClaimRecovered)}
          </div>
          <div className="stat-card-sub">সাপ্লায়ার ক্রেডিট নোট ও ছাড়পত্র প্রাপ্তি</div>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #ea580c" }}>
          <span className="stat-card-title">নেট আর্থিক ক্ষতি (Net Loss)</span>
          <div className="stat-card-value" style={{ color: "#ea580c" }}>
            {formatCurrency(netFinancialLoss)}
          </div>
          <div className="stat-card-sub">দোকানের চূড়ান্ত অপচয় লোকসান</div>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <span className="stat-card-title">রাইট-অফ আইটেম সংখ্যা</span>
          <div className="stat-card-value">
            {totalQuantityWrittenOff} ইউনিট
          </div>
          <div className="stat-card-sub">{damages.length} টি ভাউচার এন্ট্রি</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
          border: "1px solid var(--border-color)",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="🔍 প্রোডাক্টের নাম, SKU, ভাউচার বা কারণ সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
          />
        </div>

        <div>
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff" }}
          >
            <option value="ALL">সকল অপচয়ের কারণ (All Reasons)</option>
            <option value="EXPIRED">মেয়াদোত্তীর্ণ (Expired)</option>
            <option value="BROKEN_DAMAGED">ভাঙা / প্যাকেজিং নষ্ট (Broken)</option>
            <option value="LEAKAGE_SPOILAGE">লিক / পচনশীল (Spoilage)</option>
            <option value="RODENT_PEST">ইঁদুর / পোকার ক্ষতি (Pest)</option>
            <option value="INVENTORY_SHORTAGE">অডিট স্টক ঘাটতি (Shortage)</option>
          </select>
        </div>

        <div>
          <select
            value={filterDisposal}
            onChange={(e) => setFilterDisposal(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff" }}
          >
            <option value="ALL">সকল ডিসপোজাল ব্যবস্থা</option>
            <option value="SCRAPPED">ফেলে দেওয়া (Scrapped)</option>
            <option value="SUPPLIER_CLAIM">সাপ্লায়ার ক্লেইম (Supplier Claim)</option>
            <option value="CLEARANCE_DISCOUNT">ডিসকাউন্ট সেল (Discount)</option>
            <option value="DONATION">দান করা (Donated)</option>
          </select>
        </div>

        <div>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff" }}
          >
            <option value="ALL">সকল ব্রাঞ্চ / গোডাউন</option>
            <option value="Main Branch">Main Branch</option>
            <option value="Dhanmondi Branch">Dhanmondi Branch</option>
            <option value="Uttara Branch">Uttara Branch</option>
          </select>
        </div>
      </div>

      {/* Damages Table */}
      <div className="table-container">
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>🗑️ রেজিস্টার্ড ড্যামেজ ও অপচয় তালিকা</h2>
          <span className="badge badge-neutral">{filteredDamages.length} টি রেকর্ড পাওয়া গেছে</span>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>ভাউচার ও তারিখ</th>
              <th>প্রোডাক্টের বিবরণ ও ক্যাটাগরি</th>
              <th>ড্যামেজ কারণ</th>
              <th>পরিমাণ</th>
              <th>ইউনিট ক্রয়মূল্য</th>
              <th>মোট ক্ষতির পরিমাণ (৳)</th>
              <th>ডিসপোজাল ব্যবস্থা</th>
              <th>ব্রাঞ্চ ও এন্ট্রি কারক</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredDamages.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)" }}>
                  কোন ড্যামেজ রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredDamages.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <strong style={{ display: "block", color: "var(--primary-dark)", fontSize: 13 }}>{entry.voucherNo}</strong>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDateTime(entry.date)}</span>
                  </td>
                  <td>
                    <strong style={{ display: "block", color: "var(--text-main)" }}>{entry.productName}</strong>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{entry.sku}</span>
                      {entry.batchNo && <span className="badge badge-neutral" style={{ fontSize: 10 }}>Batch: {entry.batchNo}</span>}
                    </div>
                  </td>
                  <td>{getReasonBadge(entry.reason)}</td>
                  <td>
                    <strong style={{ fontSize: 14 }}>{entry.quantity}</strong> {entry.unit}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{formatCurrency(entry.costPrice)}</td>
                  <td>
                    <strong style={{ color: "var(--danger)", fontSize: 14 }}>{formatCurrency(entry.totalLoss)}</strong>
                    {entry.claimRecovered && entry.claimRecovered > 0 ? (
                      <div style={{ fontSize: 11, color: "var(--success)" }}>
                        রিকভারি: +{formatCurrency(entry.claimRecovered)}
                      </div>
                    ) : null}
                  </td>
                  <td>{getDisposalBadge(entry.disposalAction)}</td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.branch}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{entry.recordedBy}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => setSlipEntry(entry)}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      🖨️ স্লিপ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* NEW DAMAGE ENTRY MODAL */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            display: "grid",
            placeItems: "center",
            zIndex: 110,
            backdropFilter: "blur(4px)",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 580,
              padding: 24,
              boxShadow: "var(--shadow-pos)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>＋ নতুন স্টক ড্যামেজ / অপচয় এন্ট্রি</h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>নষ্ট বা মেয়াদোত্তীর্ণ পণ্যের ইনভেন্টরি রাইট-অফ ও লস হিসাব।</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDamageEntry}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ক্ষতিগ্রস্ত প্রোডাক্ট নির্বাচন করুন *</label>
                  <select
                    value={selectedProductSku}
                    onChange={(e) => handleProductChange(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                  >
                    {availableProductsMaster.map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.name} ({p.sku}) — কস্ট: ৳{p.costPrice}/{p.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ড্যামেজ পরিমাণ (Quantity) *</label>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      required
                      value={entryQty}
                      onChange={(e) => setEntryQty(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ইউনিট ক্রয়মূল্য (৳)</label>
                    <input
                      type="number"
                      required
                      value={entryCostPrice}
                      onChange={(e) => setEntryCostPrice(parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>
                </div>

                {/* Total Loss preview card */}
                <div
                  style={{
                    background: "var(--danger-bg)",
                    padding: "12px 16px",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--danger-text)" }}>হিসাবকৃত মোট অপচয় ক্ষতি (Loss Amount):</span>
                  <strong style={{ fontSize: 18, color: "var(--danger-text)" }}>
                    {formatCurrency((parseFloat(entryQty) || 0) * (entryCostPrice || 0))}
                  </strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ড্যামেজের প্রধান কারণ *</label>
                    <select
                      value={entryReason}
                      onChange={(e) => setEntryReason(e.target.value as DamageReason)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    >
                      <option value="EXPIRED">মেয়াদোত্তীর্ণ (Expired)</option>
                      <option value="BROKEN_DAMAGED">ভাঙা / প্যাকেজিং নষ্ট (Broken)</option>
                      <option value="LEAKAGE_SPOILAGE">লিক / পচনশীল (Spoilage)</option>
                      <option value="RODENT_PEST">ইঁদুর / পোকার আক্রমণ (Pest)</option>
                      <option value="INVENTORY_SHORTAGE">অডিট স্টক ঘাটতি (Shortage)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ডিসপোজাল ব্যবস্থা (Action) *</label>
                    <select
                      value={entryDisposal}
                      onChange={(e) => setEntryDisposal(e.target.value as DisposalAction)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    >
                      <option value="SCRAPPED">ফেলে দেওয়া / নষ্ট করা (Scrapped)</option>
                      <option value="SUPPLIER_CLAIM">সাপ্লায়ারকে ফেরত ও ক্লেইম (Claim)</option>
                      <option value="CLEARANCE_DISCOUNT">ডিসকাউন্টে ক্লিয়ারেন্স সেল</option>
                      <option value="DONATION">দান করা (Donation)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ব্রাঞ্চ / গোডাউন</label>
                    <select
                      value={entryBranch}
                      onChange={(e) => setEntryBranch(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    >
                      <option value="Main Branch">Main Branch</option>
                      <option value="Dhanmondi Branch">Dhanmondi Branch</option>
                      <option value="Uttara Branch">Uttara Branch</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ব্যাচ / লট নম্বর (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="যেমন: B-2609-01"
                      value={entryBatch}
                      onChange={(e) => setEntryBatch(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    />
                  </div>
                </div>

                {entryDisposal === "SUPPLIER_CLAIM" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "var(--bg-subtle)", padding: 12, borderRadius: 8 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>সাপ্লায়ার কোম্পানির নাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: Meghna Group / ACI"
                        value={entrySupplier}
                        onChange={(e) => setEntrySupplier(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ক্লেইম রিকভারি প্রাপ্তি (৳)</label>
                      <input
                        type="number"
                        value={entryClaimRecovered}
                        onChange={(e) => setEntryClaimRecovered(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>নোট ও পর্যবেক্ষণের বিবরণ</label>
                  <textarea
                    rows={2}
                    value={entryNotes}
                    onChange={(e) => setEntryNotes(e.target.value)}
                    placeholder="কীভাবে ক্ষতি হলো বা কী ব্যবস্থা নেওয়া হয়েছে লিখুন..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary" style={{ background: "var(--danger)" }}>
                  ✓ ড্যামেজ কনফার্ম ও স্টক কমান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE DAMAGE VOUCHER SLIP MODAL */}
      {slipEntry && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            display: "grid",
            placeItems: "center",
            zIndex: 120,
            backdropFilter: "blur(4px)",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 520,
              padding: 32,
              boxShadow: "var(--shadow-pos)",
            }}
          >
            <div style={{ borderBottom: "2px dashed #94a3b8", paddingBottom: 16, textAlign: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase" }}>UNBEATABLE RETAIL ERP</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>ইনভেন্টরি স্টক ড্যামেজ ও অপচয় রাইট-অফ ভাউচার</p>
              <div style={{ marginTop: 8, display: "inline-block", padding: "4px 12px", background: "#f1f5f9", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                Voucher #: {slipEntry.voucherNo}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, marginBottom: 20 }}>
              <div><strong>তারিখ:</strong> {formatDateTime(slipEntry.date)}</div>
              <div><strong>ব্রাঞ্চ:</strong> {slipEntry.branch}</div>
              <div><strong>এন্ট্রি কারক:</strong> {slipEntry.recordedBy}</div>
              <div><strong>ডিসপোজাল:</strong> {slipEntry.disposalAction}</div>
            </div>

            <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginBottom: 4 }}>{slipEntry.productName}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>SKU: {slipEntry.sku} {slipEntry.batchNo ? `| Batch: ${slipEntry.batchNo}` : ""}</div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid #cbd5e1", paddingTop: 8 }}>
                <span>পরিমাণ: <strong>{slipEntry.quantity} {slipEntry.unit}</strong></span>
                <span>দর: <strong>{formatCurrency(slipEntry.costPrice)}</strong></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, marginTop: 8, color: "var(--danger)" }}>
                <span>মোট ক্ষতির পরিমাণ:</span>
                <span>{formatCurrency(slipEntry.totalLoss)}</span>
              </div>
            </div>

            {slipEntry.notes && (
              <div style={{ fontSize: 12, color: "#475569", background: "#fff", padding: "8px 12px", borderLeft: "3px solid #cbd5e1", marginBottom: 24 }}>
                <strong>মন্তব্য:</strong> {slipEntry.notes}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 30, borderTop: "1px solid #e2e8f0", textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginBottom: 24 }}>
              <div>
                <div style={{ borderTop: "1px solid #94a3b8", width: "80%", margin: "0 auto 4px" }} />
                স্টোর কিপারের স্বাক্ষর
              </div>
              <div>
                <div style={{ borderTop: "1px solid #94a3b8", width: "80%", margin: "0 auto 4px" }} />
                ব্রাঞ্চ ম্যানেজার / অডিটর
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSlipEntry(null)} className="btn-secondary">
                বন্ধ করুন
              </button>
              <button onClick={() => window.print()} className="btn-primary">
                🖨️ প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
