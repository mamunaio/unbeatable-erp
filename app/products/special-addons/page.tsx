"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CosmeticBatchItem {
  id: string;
  name: string;
  sku: string;
  batchNo: string;
  shade: string;
  expiryDate: string;
  stock: number;
  sampleTesterCount: number;
  originalPrice: number;
  autoDiscountPercent: number;
}

interface HardwareRackItem {
  id: string;
  name: string;
  sku: string;
  rackLocation: string;
  unitType: "KG" | "METER" | "PIECE" | "FEET";
  pricePerUnit: number;
  stockInUnits: number;
  bulkTierPrice: string;
}

const initialCosmeticBatches: CosmeticBatchItem[] = [
  { id: "cb-1", name: "Maybelline Fit Me Matte Foundation", sku: "MAY-FIT-120", batchNo: "LOT-2026-08A", shade: "Classic Ivory 120", expiryDate: "2026-10-15", stock: 18, sampleTesterCount: 2, originalPrice: 1250, autoDiscountPercent: 20 },
  { id: "cb-2", name: "L'Oreal Paris Rouge Signature Lipstick", sku: "LOR-LIP-340", batchNo: "LOT-2026-11B", shade: "Velvet Red 340", expiryDate: "2027-04-20", stock: 24, sampleTesterCount: 1, originalPrice: 950, autoDiscountPercent: 0 },
  { id: "cb-3", name: "Nivea Soft Moisturizing Cream 200ml", sku: "NIV-SFT-200M", batchNo: "LOT-2026-10-05", shade: "Standard", expiryDate: "2026-10-05", stock: 12, sampleTesterCount: 0, originalPrice: 420, autoDiscountPercent: 25 },
  { id: "cb-4", name: "Neutrogena Hydro Boost Water Gel 50g", sku: "NEU-HYD-50G", batchNo: "LOT-2027-02D", shade: "Clear / All Skin", expiryDate: "2027-08-30", stock: 35, sampleTesterCount: 1, originalPrice: 1650, autoDiscountPercent: 0 },
  { id: "cb-5", name: "The Ordinary Niacinamide 10% + Zinc 1%", sku: "ORD-NIA-30ML", batchNo: "LOT-2026-10A", shade: "Serum Clear", expiryDate: "2026-10-12", stock: 8, sampleTesterCount: 1, originalPrice: 1100, autoDiscountPercent: 15 },
];

const initialHardwareItems: HardwareRackItem[] = [
  { id: "hw-1", name: "Galvanized Iron (GI) Wire 18 Gauge", sku: "GI-WIRE-18G", rackLocation: "Rack B-04, Shelf 2", unitType: "KG", pricePerUnit: 140, stockInUnits: 250, bulkTierPrice: "50kg+: ৳130/kg" },
  { id: "hw-2", name: "RFL PVC Pipe 1 inch Class-D", sku: "RFL-PVC-1IN", rackLocation: "Aisle C, Bay 10", unitType: "FEET", pricePerUnit: 45, stockInUnits: 600, bulkTierPrice: "100ft+: ৳40/ft" },
  { id: "hw-3", name: "Stainless Steel Wood Screw 2 inch", sku: "SS-SCRW-2IN", rackLocation: "Bin Cabinet D-12", unitType: "PIECE", pricePerUnit: 4.5, stockInUnits: 2500, bulkTierPrice: "100pcs+: ৳3.8/pc" },
  { id: "hw-4", name: "Asian Paints Royale Luxury Emulsion 4L", sku: "ASN-ROY-4L", rackLocation: "Rack A-01, Ground Bay", unitType: "PIECE", pricePerUnit: 3450, stockInUnits: 15, bulkTierPrice: "5cans+: ৳3250/can" },
  { id: "hw-5", name: "Berger WeatherCoat Smooth 10L", sku: "BRG-WC-10L", rackLocation: "Rack A-02, Shelf 1", unitType: "PIECE", pricePerUnit: 6800, stockInUnits: 8, bulkTierPrice: "3cans+: ৳6500/can" },
  { id: "hw-6", name: "Gazi HDPE Pipe 3/4 inch Coiled", sku: "GZI-HDP-075", rackLocation: "Aisle D, Coil Stand", unitType: "METER", pricePerUnit: 65, stockInUnits: 450, bulkTierPrice: "50m+: ৳58/m" },
];

export default function SpecialAddonsPage() {
  const { isBengali } = useLanguage();
  const [activeTab, setActiveTab] = useState<"COSMETICS" | "HARDWARE">("COSMETICS");
  const [searchQuery, setSearchQuery] = useState("");

  // Cosmetic Batches State
  const [cosmeticBatches, setCosmeticBatches] = useState<CosmeticBatchItem[]>(initialCosmeticBatches);
  const [showCosmeticModal, setShowCosmeticModal] = useState(false);
  const [newCosmetic, setNewCosmetic] = useState({
    name: "",
    sku: "",
    batchNo: "",
    shade: "",
    expiryDate: "",
    stock: 10,
    sampleTesterCount: 1,
    originalPrice: 500,
    autoDiscountPercent: 0,
  });

  // Hardware Items State
  const [hardwareItems, setHardwareItems] = useState<HardwareRackItem[]>(initialHardwareItems);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [newHardware, setNewHardware] = useState({
    name: "",
    sku: "",
    rackLocation: "",
    unitType: "KG" as "KG" | "METER" | "PIECE" | "FEET",
    pricePerUnit: 100,
    stockInUnits: 100,
    bulkTierPrice: "",
  });

  // Hardware live calculator
  const [calcQty, setCalcQty] = useState(15.5);
  const [calcRate, setCalcRate] = useState(45);
  const [calcUnit, setCalcUnit] = useState("FEET");

  const getExpiryStatus = (expiryDateStr: string) => {
    const today = new Date("2026-09-25");
    const exp = new Date(expiryDateStr);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 0) {
      return {
        label: isBengali ? "মেয়াদোত্তীর্ণ (Expired)" : "Expired",
        tone: "badge-danger",
        urgent: true,
        days: diffDays,
      };
    }
    if (diffDays <= 30) {
      return {
        label: isBengali ? `মেয়াদ শেষ হবে (${diffDays} দিন বাকি)` : `Expiring in ${diffDays} days`,
        tone: "badge-warning",
        urgent: true,
        days: diffDays,
      };
    }
    return {
      label: isBengali ? `বৈধ (${diffDays} দিন বাকি)` : `Valid (${diffDays} days left)`,
      tone: "badge-success",
      urgent: false,
      days: diffDays,
    };
  };

  // Add Cosmetic Batch
  const handleAddCosmetic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCosmetic.name || !newCosmetic.batchNo || !newCosmetic.expiryDate) {
      alert(isBengali ? "অনুগ্রহ করে পণ্যের নাম, ব্যাচ নম্বর এবং মেয়াদোত্তীর্ণের তারিখ পূরণ করুন!" : "Please enter product name, batch lot no, and expiry date!");
      return;
    }

    const newItem: CosmeticBatchItem = {
      id: `cb-${Date.now()}`,
      name: newCosmetic.name,
      sku: newCosmetic.sku || `SKU-${Date.now().toString().slice(-4)}`,
      batchNo: newCosmetic.batchNo,
      shade: newCosmetic.shade || "Standard",
      expiryDate: newCosmetic.expiryDate,
      stock: Number(newCosmetic.stock),
      sampleTesterCount: Number(newCosmetic.sampleTesterCount),
      originalPrice: Number(newCosmetic.originalPrice),
      autoDiscountPercent: Number(newCosmetic.autoDiscountPercent),
    };

    setCosmeticBatches([newItem, ...cosmeticBatches]);
    setShowCosmeticModal(false);
    setNewCosmetic({
      name: "",
      sku: "",
      batchNo: "",
      shade: "",
      expiryDate: "",
      stock: 10,
      sampleTesterCount: 1,
      originalPrice: 500,
      autoDiscountPercent: 0,
    });
  };

  // Add Hardware Item
  const handleAddHardware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHardware.name || !newHardware.rackLocation) {
      alert(isBengali ? "অনুগ্রহ করে পণ্যের নাম এবং র্যাক লোকেশন উল্লেখ করুন!" : "Please enter item name and rack location!");
      return;
    }

    const newItem: HardwareRackItem = {
      id: `hw-${Date.now()}`,
      name: newHardware.name,
      sku: newHardware.sku || `HW-${Date.now().toString().slice(-4)}`,
      rackLocation: newHardware.rackLocation,
      unitType: newHardware.unitType,
      pricePerUnit: Number(newHardware.pricePerUnit),
      stockInUnits: Number(newHardware.stockInUnits),
      bulkTierPrice: newHardware.bulkTierPrice || "Standard Retail",
    };

    setHardwareItems([newItem, ...hardwareItems]);
    setShowHardwareModal(false);
    setNewHardware({
      name: "",
      sku: "",
      rackLocation: "",
      unitType: "KG",
      pricePerUnit: 100,
      stockInUnits: 100,
      bulkTierPrice: "",
    });
  };

  const handleExportCosmetics = () => {
    exportToCsv({
      filename: "Cosmetics_Batch_Expiry_Report",
      headers: [
        { key: "name", label: isBengali ? "প্রোডাক্টের নাম" : "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "batchNo", label: isBengali ? "ব্যাচ / লট নম্বর" : "Batch Lot No" },
        { key: "shade", label: isBengali ? "শেড / কালার টোন" : "Shade / Tone" },
        { key: "expiryDate", label: isBengali ? "মেয়াদোত্তীর্ণের তারিখ" : "Expiry Date" },
        { key: "stock", label: isBengali ? "বিক্রয়যোগ্য স্টক" : "Sellable Stock" },
        { key: "sampleTesterCount", label: isBengali ? "টেস্টার সংখ্যা" : "Testers Count" },
        { key: "originalPrice", label: isBengali ? "মূল্য (BDT)" : "Regular Price (BDT)" },
        { key: "autoDiscountPercent", label: isBengali ? "অটো-ছাড় %" : "Near-Expiry Discount %" },
      ],
      data: cosmeticBatches,
    });
  };

  const handleExportHardware = () => {
    exportToCsv({
      filename: "Hardware_Rack_Location_Pricing",
      headers: [
        { key: "name", label: isBengali ? "পণ্যের নাম" : "Item Name" },
        { key: "sku", label: "SKU" },
        { key: "rackLocation", label: isBengali ? "র্যাক / বিন লোকেশন" : "Rack / Bin Location" },
        { key: "unitType", label: isBengali ? "একক" : "Unit" },
        { key: "pricePerUnit", label: isBengali ? "একক রেট (BDT)" : "Unit Rate (BDT)" },
        { key: "stockInUnits", label: isBengali ? "মজুদ একক" : "Available Units" },
        { key: "bulkTierPrice", label: isBengali ? "পাইকারি মূল্য অফার" : "Wholesale Tier" },
      ],
      data: hardwareItems,
    });
  };

  const filteredCosmetics = cosmeticBatches.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHardware = hardwareItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rackLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringCosmeticsCount = cosmeticBatches.filter((b) => {
    const st = getExpiryStatus(b.expiryDate);
    return st.urgent;
  }).length;

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/products" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            {isBengali ? "← প্রোডাক্ট ক্যাটালগে ফিরে যান" : "← Back to Products Catalog"}
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
            {isBengali ? "🔬 বিশেষায়িত শপ মডিউল (Vertical Industry Add-ons)" : "🔬 Special Industry Add-ons (Vertical Modules)"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {isBengali
              ? "কসমেটিকস ও ফার্মাসির ব্যাচ/মেয়াদ ট্র্যাকিং এবং হার্ডওয়্যার ও পেইন্টস দোকানের র্যাক/বিন ও ফ্র্যাকশনাল পরিমাপক ইঞ্জিন।"
              : "Batch & expiry tracking for cosmetics & pharmacy, plus rack/bin locations & fractional measurement for hardware & paints."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={activeTab === "COSMETICS" ? handleExportCosmetics : handleExportHardware} className="btn-secondary">
            📥 Export CSV
          </button>
          {activeTab === "COSMETICS" ? (
            <button onClick={() => setShowCosmeticModal(true)} className="btn-primary">
              {isBengali ? "＋ নতুন ব্যাচ / লট যোগ করুন" : "＋ Add Batch / Lot"}
            </button>
          ) : (
            <button onClick={() => setShowHardwareModal(true)} className="btn-primary">
              {isBengali ? "＋ নতুন র্যাক ও আইটেম যোগ করুন" : "＋ Add Rack & Item"}
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, borderBottom: "1px solid var(--border-color)", paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab("COSMETICS")}
          style={{
            padding: "10px 18px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: activeTab === "COSMETICS" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "COSMETICS" ? "#fff" : "var(--text-main)",
            transition: "all 0.15s ease",
          }}
        >
          {isBengali
            ? "💄 কসমেটিকস ও ফার্মাসি (ব্যাচ, শেড ও মেয়াদোত্তীর্ণ ট্র্যাকার)"
            : "💄 Cosmetics & Pharmacy (Batch, Shade & Expiry Tracker)"}
        </button>

        <button
          onClick={() => setActiveTab("HARDWARE")}
          style={{
            padding: "10px 18px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: activeTab === "HARDWARE" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "HARDWARE" ? "#fff" : "var(--text-main)",
            transition: "all 0.15s ease",
          }}
        >
          {isBengali
            ? "🔧 হার্ডওয়্যার ও পেইন্টস (র্যাক/বিন লোকেশন ও ওজন/দৈর্ঘ্য ক্যালকুলেটর)"
            : "🔧 Hardware & Paints (Rack/Bin Location & Calculator)"}
        </button>
      </div>

      {/* Global Search Filter */}
      <div className="card" style={{ marginBottom: 20, padding: 12 }}>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === "COSMETICS"
              ? isBengali
                ? "🔍 পণ্যের নাম, ব্যাচ নম্বর (LOT) বা শেড দিয়ে খুঁজুন..."
                : "🔍 Search by product name, batch (LOT) or shade..."
              : isBengali
                ? "🔍 হার্ডওয়্যার আইটেম বা র্যাক লোকেশন (যেমন: Rack B-04) দিয়ে খুঁজুন..."
                : "🔍 Search hardware item or rack location (e.g. Rack B-04)..."
          }
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            outline: "none",
            fontSize: 14,
          }}
        />
      </div>

      {/* TAB 1: COSMETICS & PHARMACY */}
      {activeTab === "COSMETICS" && (
        <div>
          {/* Quick Metrics */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <span className="stat-card-title">{isBengali ? "মোট ট্র্যাকিং ব্যাচ" : "Total Tracked Batches"}</span>
              <div className="stat-card-value">
                {isBengali ? `${cosmeticBatches.length}টি লট` : `${cosmeticBatches.length} Lots`}
              </div>
              <div className="stat-card-sub">{isBengali ? "লট/ব্যাচ নাম্বার সক্রিয়" : "Active batch lots"}</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-title">
                {isBengali ? "দ্রুত মেয়াদ শেষ হবে (< ৩০ দিন)" : "Expiring Soon (< 30 Days)"}
              </span>
              <div className="stat-card-value" style={{ color: "var(--danger)" }}>
                {isBengali ? `${expiringCosmeticsCount}টি ব্যাচ` : `${expiringCosmeticsCount} Batches`}
              </div>
              <div className="stat-card-sub">{isBengali ? "অটোমেটিক স্পেশাল ছাড় সক্রিয়" : "Auto near-expiry discount active"}</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-title">{isBengali ? "স্যাম্পল / টেস্টার সংখ্যা" : "Sample & Tester Stock"}</span>
              <div className="stat-card-value">
                {cosmeticBatches.reduce((acc, curr) => acc + curr.sampleTesterCount, 0)}{" "}
                {isBengali ? "টি টেস্টার" : "Testers"}
              </div>
              <div className="stat-card-sub">{isBengali ? "কাস্টমার ট্রায়াল স্টক সেপারেট" : "Separated customer trial stock"}</div>
            </div>
          </div>

          <div className="table-container">
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                  {isBengali ? "ব্যাচ, শেড ও এক্সপায়ারি ট্র্যাকিং তালিকা" : "Batch, Shade & Expiry Tracking Register"}
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isBengali
                    ? "FEFO (First Expired First Out) ইনভেন্টরি নিয়ম অনুযায়ী বিক্রয় সুপারিশ করা হয়।"
                    : "FEFO (First Expired First Out) inventory rule recommended for dispatch."}
                </span>
              </div>
              <span className="badge badge-warning">Near-Expiry Auto-Discount Engine Active</span>
            </div>

            <table className="erp-table">
              <thead>
                <tr>
                  <th>{isBengali ? "প্রোডাক্টের নাম" : "Product Name"}</th>
                  <th>{isBengali ? "ব্যাচ / লট নম্বর" : "Batch / Lot No"}</th>
                  <th>{isBengali ? "শেড / কালার টোন" : "Shade / Color Tone"}</th>
                  <th>{isBengali ? "মেয়াদোত্তীর্ণের তারিখ" : "Expiry Date"}</th>
                  <th>{isBengali ? "স্টক ও স্যাম্পল" : "Stock & Samples"}</th>
                  <th>{isBengali ? "মূল্য ও অটো-ছাড়" : "Price & Discount"}</th>
                  <th>{isBengali ? "মেয়াদ স্ট্যাটাস" : "Expiry Status"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCosmetics.map((item) => {
                  const status = getExpiryStatus(item.expiryDate);
                  const effectivePrice = item.originalPrice * (1 - item.autoDiscountPercent / 100);
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <span style={{ fontSize: 11, fontFamily: "monospace", display: "block", color: "var(--text-muted)" }}>
                          {item.sku}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontFamily: "monospace", fontWeight: 700 }}>
                          {item.batchNo}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary-dark)" }}>{item.shade}</span>
                      </td>
                      <td>
                        <strong>{formatDate(item.expiryDate)}</strong>
                      </td>
                      <td>
                        <strong>{item.stock} {isBengali ? "বিক্রয়যোগ্য" : "Available"}</strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>
                          ({item.sampleTesterCount} {isBengali ? "টি টেস্টার" : "Testers"})
                        </span>
                      </td>
                      <td>
                        {item.autoDiscountPercent > 0 ? (
                          <div>
                            <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: 12 }}>
                              {formatCurrency(item.originalPrice)}
                            </span>
                            <strong style={{ color: "var(--danger)", display: "block", fontSize: 14 }}>
                              {formatCurrency(effectivePrice)} (-{item.autoDiscountPercent}%)
                            </strong>
                          </div>
                        ) : (
                          <strong>{formatCurrency(item.originalPrice)}</strong>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${status.tone}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HARDWARE, PAINTS & PLASTICS */}
      {activeTab === "HARDWARE" && (
        <div>
          {/* Custom Cutting & Weight Measurement Calculator Widget */}
          <div className="card" style={{ marginBottom: 24, background: "var(--bg-subtle)", border: "1.5px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>
                  {isBengali
                    ? "📐 ফ্র্যাকশনাল কাটিং ও ওজন পরিমাপক ক্যালকুলেটর (Variable Billing Engine)"
                    : "📐 Fractional Cutting & Weight Calculator (Variable Billing Engine)"}
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {isBengali
                    ? "পাইপ, রড, তার বা রঙের কাস্টম পরিমাপ দিয়ে তাৎক্ষণিক বিল রেট হিসাব করুন।"
                    : "Instantly calculate billing totals for custom lengths, cuts and weights of pipes, rods, wires, or paints."}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                  onClick={() => {
                    setCalcQty(25);
                    setCalcRate(140);
                    setCalcUnit("KG");
                  }}
                >
                  ⚡ GI Wire (25 kg)
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                  onClick={() => {
                    setCalcQty(18.5);
                    setCalcRate(45);
                    setCalcUnit("FEET");
                  }}
                >
                  ⚡ PVC Pipe (18.5 ft)
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: 16, alignItems: "center" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? "পরিমাপের একক (Unit)" : "Measurement Unit"}
                </label>
                <select
                  value={calcUnit}
                  onChange={(e) => setCalcUnit(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontWeight: 700 }}
                >
                  <option value="FEET">{isBengali ? "FEET (ফুট)" : "FEET (ft)"}</option>
                  <option value="METER">{isBengali ? "METER (মিটার)" : "METER (m)"}</option>
                  <option value="KG">{isBengali ? "KG (কেজি)" : "KG (kg)"}</option>
                  <option value="PIECE">{isBengali ? "PIECE (পিস)" : "PIECE (pcs)"}</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? "পরিমাণ / দৈর্ঘ্য / ওজন" : "Quantity / Length / Weight"}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? `প্রতি একক রেট (৳ / ${calcUnit})` : `Rate Per Unit (৳ / ${calcUnit})`}
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontWeight: 700 }}
                />
              </div>

              <div style={{ background: "#fff", padding: "12px 18px", borderRadius: 8, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: 700 }}>
                  {isBengali
                    ? `হিসাবকৃত প্রদেয় মূল্য (${calcQty} ${calcUnit} × ${formatCurrency(calcRate)})`
                    : `Calculated Total (${calcQty} ${calcUnit} × ${formatCurrency(calcRate)})`}
                </span>
                <strong style={{ fontSize: 22, color: "var(--primary)", display: "block", marginTop: 2 }}>
                  {formatCurrency(calcQty * calcRate)}
                </strong>
              </div>
            </div>
          </div>

          <div className="table-container">
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                  {isBengali
                    ? "র্যাক ও তাক লোকেশন ইনডেক্স এবং পাইকারি টায়ার প্রাইসিং"
                    : "Rack & Bin Location Index & Wholesale Tier Pricing"}
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isBengali
                    ? "সেলসম্যান দ্রুত র্যাক কোড দেখে গোডাউন বা ডিসপ্লে থেকে পণ্য খুঁজে বের করতে পারবেন।"
                    : "Staff can quickly locate items in godown/display using rack codes."}
                </span>
              </div>
              <span className="badge badge-primary">Rack / Bin Indexed</span>
            </div>

            <table className="erp-table">
              <thead>
                <tr>
                  <th>{isBengali ? "পণ্যের নাম" : "Item Name"}</th>
                  <th>SKU</th>
                  <th>{isBengali ? "র্যাক ও তাক লোকেশন (Rack/Bin)" : "Rack / Bin Location"}</th>
                  <th>{isBengali ? "একক টাইপ" : "Unit Type"}</th>
                  <th>{isBengali ? "খুচরা রেট" : "Retail Rate"}</th>
                  <th>{isBengali ? "বর্তমান স্টক" : "Current Stock"}</th>
                  <th>{isBengali ? "পাইকারি মূল্য টায়ার (Bulk Discount)" : "Wholesale Tier (Bulk Discount)"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHardware.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{item.sku}</span>
                    </td>
                    <td>
                      <span
                        className="badge badge-neutral"
                        style={{
                          fontWeight: 700,
                          background: "var(--primary-light)",
                          color: "var(--primary-dark)",
                          border: "1px solid rgba(79, 70, 229, 0.2)",
                        }}
                      >
                        📍 {item.rackLocation}
                      </span>
                    </td>
                    <td>
                      <strong>{item.unitType}</strong>
                    </td>
                    <td>
                      <strong style={{ color: "var(--primary-dark)" }}>{formatCurrency(item.pricePerUnit)}</strong> / {item.unitType}
                    </td>
                    <td>
                      <strong>{item.stockInUnits}</strong> {item.unitType}
                    </td>
                    <td>
                      <span className="badge badge-success">{item.bulkTierPrice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD COSMETIC BATCH */}
      {showCosmeticModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                {isBengali ? "💄 নতুন কসমেটিকস ব্যাচ / লট যোগ করুন" : "💄 Add New Cosmetic Batch / Lot"}
              </h2>
              <button onClick={() => setShowCosmeticModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCosmetic} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? "পণ্যের নাম *" : "Product Name *"}
                </label>
                <input
                  required
                  placeholder={isBengali ? "যেমন: Maybelline SuperStay Matte Ink" : "e.g. Maybelline SuperStay Matte Ink"}
                  value={newCosmetic.name}
                  onChange={(e) => setNewCosmetic({ ...newCosmetic, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "লট / ব্যাচ নং *" : "Lot / Batch No *"}
                  </label>
                  <input
                    required
                    placeholder={isBengali ? "যেমন: LOT-2026-11C" : "e.g. LOT-2026-11C"}
                    value={newCosmetic.batchNo}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, batchNo: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "শেড / কালার টোন" : "Shade / Tone"}
                  </label>
                  <input
                    placeholder={isBengali ? "যেমন: Shade 115 / Natural" : "e.g. Shade 115 / Natural"}
                    value={newCosmetic.shade}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, shade: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "মেয়াদোত্তীর্ণের তারিখ *" : "Expiry Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={newCosmetic.expiryDate}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, expiryDate: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "মূল বিক্রয়মূল্য (৳)" : "Regular Selling Price (৳)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCosmetic.originalPrice}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, originalPrice: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "বিক্রয়যোগ্য স্টক" : "Sellable Stock"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCosmetic.stock}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, stock: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "টেস্টার / স্যাম্পল" : "Testers / Samples"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCosmetic.sampleTesterCount}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, sampleTesterCount: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "অটো-ছাড় %" : "Auto Discount %"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={newCosmetic.autoDiscountPercent}
                    onChange={(e) => setNewCosmetic({ ...newCosmetic, autoDiscountPercent: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCosmeticModal(false)} className="btn-secondary">
                  {isBengali ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn-primary">
                  {isBengali ? "সংরক্ষণ করুন" : "Save Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD HARDWARE & RACK ITEM */}
      {showHardwareModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                {isBengali ? "🔧 নতুন হার্ডওয়্যার পণ্য ও র্যাক লোকেশন যোগ করুন" : "🔧 Add Hardware Item & Rack Location"}
              </h2>
              <button onClick={() => setShowHardwareModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHardware} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? "পণ্যের নাম *" : "Product Name *"}
                </label>
                <input
                  required
                  placeholder={isBengali ? "যেমন: BSRM 12mm Rebar Steel Rod" : "e.g. BSRM 12mm Rebar Steel Rod"}
                  value={newHardware.name}
                  onChange={(e) => setNewHardware({ ...newHardware, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "র্যাক ও তাক লোকেশন (Rack/Bin) *" : "Rack / Bin Location *"}
                  </label>
                  <input
                    required
                    placeholder={isBengali ? "যেমন: Rack C-02, Bay 4" : "e.g. Rack C-02, Bay 4"}
                    value={newHardware.rackLocation}
                    onChange={(e) => setNewHardware({ ...newHardware, rackLocation: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "পরিমাপের একক (Unit)" : "Measurement Unit"}
                  </label>
                  <select
                    value={newHardware.unitType}
                    onChange={(e) => setNewHardware({ ...newHardware, unitType: e.target.value as any })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  >
                    <option value="KG">{isBengali ? "কেজি (KG)" : "Kilogram (KG)"}</option>
                    <option value="FEET">{isBengali ? "ফুট (FEET)" : "Feet (FEET)"}</option>
                    <option value="METER">{isBengali ? "মিটার (METER)" : "Meter (METER)"}</option>
                    <option value="PIECE">{isBengali ? "পিস (PIECE)" : "Piece (PIECE)"}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "প্রতি একক রেট (৳)" : "Rate Per Unit (৳)"}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newHardware.pricePerUnit}
                    onChange={(e) => setNewHardware({ ...newHardware, pricePerUnit: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {isBengali ? "মোট প্রারম্ভিক স্টক" : "Initial Stock Units"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newHardware.stockInUnits}
                    onChange={(e) => setNewHardware({ ...newHardware, stockInUnits: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  {isBengali ? "পাইকারি টায়ার মূল্য অফার (Wholesale Tier)" : "Wholesale Bulk Tier Pricing"}
                </label>
                <input
                  placeholder={isBengali ? "যেমন: 50kg+: ৳125/kg, 100kg+: ৳120/kg" : "e.g. 50kg+: ৳125/kg, 100kg+: ৳120/kg"}
                  value={newHardware.bulkTierPrice}
                  onChange={(e) => setNewHardware({ ...newHardware, bulkTierPrice: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowHardwareModal(false)} className="btn-secondary">
                  {isBengali ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn-primary">
                  {isBengali ? "সংরক্ষণ করুন" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
