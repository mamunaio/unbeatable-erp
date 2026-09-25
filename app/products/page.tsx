"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

import { exportToCsv } from "@/lib/export";

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
  { id: "1", name: "Miniket Rice 25kg", sku: "RICE-MIN-25", barcode: "89411001", category: "Grocery", stock: 45, reorderPoint: 10, purchasePrice: 1650, sellingPrice: 1850, status: "ACTIVE" },
  { id: "2", name: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", barcode: "89411002", category: "Grocery", stock: 30, reorderPoint: 15, purchasePrice: 760, sellingPrice: 820, status: "ACTIVE" },
  { id: "3", name: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", barcode: "89411003", category: "Dairy", stock: 60, reorderPoint: 20, purchasePrice: 78, sellingPrice: 90, status: "ACTIVE" },
  { id: "4", name: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", barcode: "89411004", category: "Dairy", stock: 15, reorderPoint: 10, purchasePrice: 780, sellingPrice: 840, status: "ACTIVE" },
  { id: "5", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", barcode: "89411007", category: "Personal Care", stock: 8, reorderPoint: 15, purchasePrice: 52, sellingPrice: 65, status: "ACTIVE" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products] = useState<ProductRow[]>(initialProducts);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
  );

  const handleExport = () => {
    exportToCsv({
      filename: "Unbeatable_Products_Catalog",
      headers: [
        { key: "name", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "barcode", label: "Barcode" },
        { key: "category", label: "Category" },
        { key: "stock", label: "Current Stock" },
        { key: "purchasePrice", label: "Purchase Cost (BDT)" },
        { key: "sellingPrice", label: "Selling Price (BDT)" },
        { key: "status", label: "Status" },
      ],
      data: filtered,
    });
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>প্রোডাক্ট ক্যাটালগ (Products Catalog)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের সকল পণ্য, বারকোড, ক্রয়মূল্য ও বিক্রয়মূল্য পরিচালনা করুন।</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/products/special-addons" className="btn-secondary" style={{ background: "var(--primary-light)", color: "var(--primary-dark)", borderColor: "var(--primary)" }}>
            🔬 স্পেশাল অ্যাড-অন (ব্যাচ ও র্যাক)
          </Link>
          <Link href="/products/barcode" className="btn-secondary">
            🏷️ Barcode Print
          </Link>
          <button onClick={handleExport} className="btn-secondary">📥 Export Excel</button>
          <Link href="/products/new" className="btn-primary">
            ＋ নতুন প্রোডাক্ট যুক্ত করুন
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 প্রোডাক্টের নাম, SKU বা বারকোড দিয়ে খুঁজুন..."
            style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", outline: "none", fontSize: 14 }}
          />
          <button className="btn-secondary">⚙️ ফিল্টার</button>
        </div>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>প্রোডাক্টের নাম</th>
              <th>SKU / বারকোড</th>
              <th>ক্যাটাগরি</th>
              <th>স্টক সংখ্যা</th>
              <th>ক্রয়মূল্য</th>
              <th>বিক্রয়মূল্য</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong style={{ display: "block", color: "var(--text-main)" }}>{p.name}</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ID: {p.id}</span>
                </td>
                <td>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--primary-dark)" }}>{p.sku}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.barcode}</div>
                </td>
                <td>
                  <span className="badge badge-neutral">{p.category}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: p.stock <= p.reorderPoint ? "var(--danger)" : "inherit" }}>
                    {p.stock}
                  </span>
                  {p.stock <= p.reorderPoint && (
                    <span className="badge badge-warning" style={{ marginLeft: 6, fontSize: 10 }}>Low Stock</span>
                  )}
                </td>
                <td>{formatCurrency(p.purchasePrice)}</td>
                <td><strong style={{ color: "var(--primary)" }}>{formatCurrency(p.sellingPrice)}</strong></td>
                <td>
                  <span className="badge badge-success">{p.status}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: 12 }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
