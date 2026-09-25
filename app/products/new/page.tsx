"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "Grocery",
    purchasePrice: "",
    sellingPrice: "",
    wholesalePrice: "",
    mrp: "",
    stock: "",
    reorderPoint: "10",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate creation
    setTimeout(() => {
      setLoading(false);
      router.push("/products");
    }, 400);
  };

  return (
    <main className="page-container" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/products" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← ক্যাটালগে ফিরে যান
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>নতুন প্রোডাক্ট যুক্ত করুন</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের নতুন আইটেমের তথ্য, দাম এবং স্টক প্যারামিটার প্রদান করুন।</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {/* Section 1: Basic info */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "var(--primary-dark)" }}>১. সাধারণ তথ্য (General Info)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>প্রোডাক্টের নাম *</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="যেমন: Miniket Rice 25kg"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>SKU কোড *</label>
            <input
              required
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="যেমন: RICE-MIN-25"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>বারকোড (Barcode)</label>
            <input
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="বারকোড স্ক্যান করুন বা টাইপ করুন"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>ক্যাটাগরি</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none", background: "#fff" }}
            >
              <option value="Grocery">Grocery (মুদি)</option>
              <option value="Dairy">Dairy (দুগ্ধজাত)</option>
              <option value="Spices">Spices (মসলা)</option>
              <option value="Personal Care">Personal Care (কসমেটিকস)</option>
              <option value="Beverage">Beverage (পানীয়)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "var(--primary-dark)" }}>২. মূল্য ও লাভ (Pricing)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>ক্রয়মূল্য (Purchase Price ৳) *</label>
            <input
              required
              type="number"
              step="0.01"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="0.00"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>খুচরা বিক্রয়মূল্য (Selling Price ৳) *</label>
            <input
              required
              type="number"
              step="0.01"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="0.00"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>সর্বোচ্চ খুচরা মূল্য (MRP ৳)</label>
            <input
              type="number"
              step="0.01"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="0.00"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>
        </div>

        {/* Section 3: Stock Setup */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "var(--primary-dark)" }}>৩. স্টক ও সতর্কতা (Inventory Setup)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>প্রারম্ভিক স্টক (Opening Stock)</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>লো-স্টক এলার্ট লিমিট (Reorder Point)</label>
            <input
              type="number"
              name="reorderPoint"
              value={formData.reorderPoint}
              onChange={handleChange}
              placeholder="10"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: 6, outline: "none" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/products" className="btn-secondary">
            বাতিল
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "সংরক্ষণ হচ্ছে..." : "✓ প্রোডাক্ট সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </main>
  );
}
