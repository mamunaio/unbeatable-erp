"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
}

const sampleProducts: ProductItem[] = [
  { id: "1", name: "Miniket Rice 25kg", sku: "RICE-MIN-25", barcode: "89411001", price: 1850 },
  { id: "2", name: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", barcode: "89411002", price: 820 },
  { id: "3", name: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", barcode: "89411003", price: 90 },
  { id: "4", name: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", barcode: "89411004", price: 840 },
  { id: "5", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", barcode: "89411007", price: 65 },
  { id: "6", name: "Parachute Coconut Oil 200ml", sku: "OIL-PAR-200M", barcode: "89411008", price: 160 },
];

export default function BarcodePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(sampleProducts[0]);
  const [labelCount, setLabelCount] = useState(12);
  const [storeName, setStoreName] = useState("UNBEATABLE STORE");
  const [showPrice, setShowPrice] = useState(true);

  return (
    <main className="page-container">
      {/* Non-print controls */}
      <div className="no-print" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 16 }}>
          <div>
            <Link href="/products" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
              ← ক্যাটালগে ফিরে যান
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🏷️ বারকোড স্টিকার প্রিন্ট স্টুডিও</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>থার্মাল স্টিকার প্রিন্টার বা A4 লেবেল পেপারে বারকোড প্রিন্ট করুন।</p>
          </div>
          <button onClick={() => window.print()} className="btn-primary" style={{ padding: "10px 24px", fontSize: 15 }}>
            🖨️ প্রিন্ট করুন (Print Labels)
          </button>
        </div>

        {/* Configuration Panel */}
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>প্রোডাক্ট নির্বাচন করুন</label>
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const prod = sampleProducts.find((p) => p.id === e.target.value);
                if (prod) setSelectedProduct(prod);
              }}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff" }}
            >
              {sampleProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.barcode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>স্টিকার সংখ্যা (Quantity)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={labelCount}
              onChange={(e) => setLabelCount(Math.max(1, Number(e.target.value) || 1))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>দোকানের নাম (Header)</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
              <span>বিক্রয়মূল্য (MRP) প্রদর্শন করুন</span>
            </label>
          </div>
        </div>
      </div>

      {/* Printable Stickers Sheet */}
      <div className="printable-sheet">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            border: "1px solid var(--border-color)",
          }}
        >
          {Array.from({ length: labelCount }).map((_, index) => (
            <div
              key={index}
              className="barcode-sticker"
              style={{
                width: "100%",
                maxWidth: 220,
                border: "1px dashed #94a3b8",
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "var(--font-sans)",
                margin: "0 auto",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "#0f172a" }}>
                {storeName}
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, margin: "2px 0", color: "#1e293b", lineHeight: 1.2 }}>
                {selectedProduct.name}
              </div>

              {/* Vector Barcode Representation */}
              <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <svg width="150" height="36" viewBox="0 0 150 36">
                  {/* High contrast barcode bars */}
                  {[3, 7, 12, 16, 22, 25, 29, 35, 41, 44, 50, 56, 61, 67, 72, 78, 83, 89, 95, 99, 105, 111, 116, 122, 128, 134, 140, 145].map((x, i) => (
                    <rect
                      key={i}
                      x={x}
                      y="2"
                      width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5}
                      height="32"
                      fill="#000"
                    />
                  ))}
                </svg>
                <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 2, fontWeight: 700, color: "#000" }}>
                  {selectedProduct.barcode}
                </span>
              </div>

              {showPrice && (
                <div style={{ fontSize: 13, fontWeight: 800, color: "#000", borderTop: "1px solid #e2e8f0", width: "100%", paddingTop: 2 }}>
                  MRP: {formatCurrency(selectedProduct.price)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print, .sidebar, .topbar {
            display: none !important;
          }
          .page-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .printable-sheet {
            padding: 0 !important;
          }
          .printable-sheet > div {
            border: none !important;
            padding: 0 !important;
            gap: 8px !important;
          }
          .barcode-sticker {
            page-break-inside: avoid;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>
    </main>
  );
}
