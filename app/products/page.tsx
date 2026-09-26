"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  IconProducts,
  IconPlus,
  IconPrint,
  IconExport,
  IconSearch,
  IconSpecialAddons,
} from "@/components/Icons";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  reorderPoint: number;
  purchasePrice: number;
  sellingPrice: number;
  status: "ACTIVE" | "ARCHIVED";
}

const initialProducts: ProductRow[] = [
  { id: "1", name: "Miniket Premium Rice 25kg", sku: "RICE-MIN-25", barcode: "89411001", category: "Grocery", stock: 45, reorderPoint: 10, purchasePrice: 1650, sellingPrice: 1850, status: "ACTIVE" },
  { id: "2", name: "Rupchanda Soyabean Oil 5L", sku: "OIL-SOY-5L", barcode: "89411002", category: "Grocery", stock: 30, reorderPoint: 15, purchasePrice: 760, sellingPrice: 820, status: "ACTIVE" },
  { id: "3", name: "Aarong Fresh Milk 1 Litre", sku: "MILK-AAR-1L", barcode: "89411003", category: "Dairy", stock: 60, reorderPoint: 20, purchasePrice: 78, sellingPrice: 90, status: "ACTIVE" },
  { id: "4", name: "Dano Full Cream Milk 1kg", sku: "MILK-DAN-1KG", barcode: "89411004", category: "Dairy", stock: 15, reorderPoint: 10, purchasePrice: 780, sellingPrice: 840, status: "ACTIVE" },
  { id: "5", name: "Radhuni Turmeric Powder 200g", sku: "RAD-TUR-200G", barcode: "89411005", category: "Spices", stock: 50, reorderPoint: 12, purchasePrice: 92, sellingPrice: 110, status: "ACTIVE" },
  { id: "6", name: "Ispahani Mirzapore Tea 400g", sku: "TEA-ISP-400G", barcode: "89411006", category: "Beverage", stock: 40, reorderPoint: 10, purchasePrice: 195, sellingPrice: 220, status: "ACTIVE" },
  { id: "7", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", barcode: "89411007", category: "Personal Care", stock: 8, reorderPoint: 15, purchasePrice: 52, sellingPrice: 65, status: "ACTIVE" },
  { id: "8", name: "Parachute Coconut Oil 200ml", sku: "OIL-PAR-200M", barcode: "89411008", category: "Personal Care", stock: 25, reorderPoint: 10, purchasePrice: 135, sellingPrice: 160, status: "ACTIVE" },
];

export default function ProductsPage() {
  const { isBengali } = useLanguage();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [products] = useState<ProductRow[]>(initialProducts);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);
    const matchesCat = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalStockValue = products.reduce((acc, p) => acc + p.purchasePrice * p.stock, 0);
  const totalRetailValue = products.reduce((acc, p) => acc + p.sellingPrice * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.reorderPoint).length;

  const handleExport = () => {
    exportToCsv({
      filename: "Unbeatable_Products_Catalog",
      headers: [
        { key: "name", label: isBengali ? "প্রোডাক্টের নাম" : "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "barcode", label: isBengali ? "বারকোড" : "Barcode" },
        { key: "category", label: isBengali ? "ক্যাটাগরি" : "Category" },
        { key: "stock", label: isBengali ? "মজুদ স্টক" : "Current Stock" },
        { key: "purchasePrice", label: isBengali ? "ক্রয়মূল্য (BDT)" : "Purchase Cost (BDT)" },
        { key: "sellingPrice", label: isBengali ? "বিক্রয়মূল্য (BDT)" : "Selling Price (BDT)" },
        { key: "status", label: isBengali ? "স্ট্যাটাস" : "Status" },
      ],
      data: filtered,
    });
  };

  const categories = ["ALL", "Grocery", "Dairy", "Spices", "Beverage", "Personal Care"];

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge badge-primary">Catalog Master</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
              {products.length} {isBengali ? "টি প্রোডাক্ট সক্রিয়" : "Products Active"}
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-main)", marginTop: 4, letterSpacing: "-0.5px" }}>
            {isBengali ? "📦 প্রোডাক্ট ক্যাটালগ ও প্রাইজ লিস্ট" : "📦 Product Catalog & Price List"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5 }}>
            {isBengali
              ? "দোকানের সকল পণ্য, বারকোড, ক্রয়মূল্য, বিক্রয়মূল্য ও ইনভেন্টরি স্টক পরিচালনা।"
              : "Store item catalog, barcode indexing, cost prices, selling rates and stock management."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/products/special-addons" className="btn-secondary">
            <IconSpecialAddons size={16} color="var(--primary)" />
            <span>{isBengali ? "স্পেশাল অ্যাড-অন (ব্যাচ ও র্যাক)" : "Special Add-ons (Batch & Rack)"}</span>
          </Link>
          <Link href="/products/barcode" className="btn-secondary">
            <IconPrint size={16} />
            <span>{isBengali ? "বারকোড প্রিন্টার" : "Barcode Printer"}</span>
          </Link>
          <button onClick={handleExport} className="btn-secondary">
            <IconExport size={16} />
            <span>Export CSV</span>
          </button>
          <Link href="/products/new" className="btn-primary">
            <IconPlus size={16} />
            <span>{isBengali ? "নতুন প্রোডাক্ট যোগ করুন" : "Add New Product"}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderTop: "3px solid var(--primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="stat-card-title">{isBengali ? "মোট প্রোডাক্ট সংখ্যা" : "Total Products"}</span>
              <div className="stat-card-value" style={{ marginTop: 4 }}>
                {products.length} {isBengali ? "আইটেম" : "Items"}
              </div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--primary-light)", display: "grid", placeItems: "center" }}>
              <IconProducts size={20} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-card-sub">{isBengali ? "অ্যাক্টিভ এসকেইউ ও বারকোড" : "Active SKUs & barcodes"}</div>
        </div>

        <div className="stat-card" style={{ borderTop: "3px solid var(--success)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="stat-card-title">
                {isBengali ? "মোট মজুদ স্টক ভ্যালু (ক্রয়মূল্য)" : "Total Stock Valuation (Cost)"}
              </span>
              <div className="stat-card-value" style={{ marginTop: 4, color: "var(--success-text)" }}>
                {formatCurrency(totalStockValue)}
              </div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--success-bg)", display: "grid", placeItems: "center" }}>
              <span style={{ fontSize: 18, color: "var(--success)" }}>৳</span>
            </div>
          </div>
          <div className="stat-card-sub">
            {isBengali ? "সম্ভাব্য বিক্রয় মূল্য:" : "Potential Retail Value:"} {formatCurrency(totalRetailValue)}
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: "3px solid var(--warning)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="stat-card-title">{isBengali ? "লো-স্টক সতর্কবার্তা" : "Low Stock Alerts"}</span>
              <div className="stat-card-value" style={{ marginTop: 4, color: "var(--warning-text)" }}>
                {lowStockCount} {isBengali ? "টি আইটেম" : "Items"}
              </div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--warning-bg)", display: "grid", placeItems: "center" }}>
              <span style={{ fontSize: 18, color: "var(--warning)" }}>⚠️</span>
            </div>
          </div>
          <div className="stat-card-sub">
            {isBengali ? "রি-অর্ডার পয়েন্টের নিচে নেমে গেছে" : "Below reorder threshold"}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "#ffffff",
          padding: 16,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-color)",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              width: "100%",
              maxWidth: 380,
            }}
          >
            <IconSearch size={16} color="var(--text-muted)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isBengali
                  ? "🔍 প্রোডাক্টের নাম, SKU বা বারকোড খুঁজুন..."
                  : "🔍 Search product name, SKU or barcode..."
              }
              style={{ width: "100%", border: "none", background: "transparent", fontSize: 13.5 }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: categoryFilter === cat ? "var(--primary)" : "var(--bg-subtle)",
                color: categoryFilter === cat ? "#ffffff" : "var(--text-muted)",
                boxShadow: categoryFilter === cat ? "0 2px 6px rgba(79, 70, 229, 0.3)" : "none",
                transition: "all var(--transition-fast)",
              }}
            >
              {cat === "ALL" ? (isBengali ? "সকল ক্যাটাগরি" : "All Categories") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Products Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>{isBengali ? "প্রোডাক্টের বিবরণ" : "Product Details"}</th>
              <th>{isBengali ? "SKU / বারকোড" : "SKU / Barcode"}</th>
              <th>{isBengali ? "ক্যাটাগরি" : "Category"}</th>
              <th>{isBengali ? "বর্তমান মজুদ (Stock)" : "Stock Level"}</th>
              <th>{isBengali ? "ক্রয়মূল্য (Cost)" : "Purchase Cost"}</th>
              <th>{isBengali ? "বিক্রয়মূল্য (MRP)" : "Selling Price"}</th>
              <th>{isBengali ? "প্রফিট মার্জিন" : "Profit Margin"}</th>
              <th>{isBengali ? "স্ট্যাটাস" : "Status"}</th>
              <th style={{ textAlign: "right" }}>{isBengali ? "একশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
                  {isBengali ? "কোনো প্রোডাক্ট পাওয়া যায়নি।" : "No products found."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const margin = p.sellingPrice - p.purchasePrice;
                const marginPct = ((margin / p.sellingPrice) * 100).toFixed(1);
                const isLowStock = p.stock <= p.reorderPoint;
                return (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ display: "block", fontSize: 14, color: "var(--text-main)" }}>{p.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", display: "block" }}>
                        {p.sku}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Barcode: {p.barcode}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: 14, color: isLowStock ? "var(--danger)" : "var(--text-main)" }}>
                        {p.stock}
                      </strong>
                      {isLowStock && <span className="badge badge-danger" style={{ marginLeft: 6, fontSize: 10 }}>Low</span>}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{formatCurrency(p.purchasePrice)}</td>
                    <td>
                      <strong style={{ fontSize: 14, color: "var(--success-text)" }}>{formatCurrency(p.sellingPrice)}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-dark)" }}>
                        +{formatCurrency(margin)} ({marginPct}%)
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">● Active</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <Link
                          href={`/products/barcode`}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: 12 }}
                          title={isBengali ? "বারকোড স্টিকার প্রিন্ট করুন" : "Print Barcode Sticker"}
                        >
                          <IconPrint size={13} />
                        </Link>
                        <Link
                          href={`/products/new`}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: 12 }}
                        >
                          {isBengali ? "এডিট" : "Edit"}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
