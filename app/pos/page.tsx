"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  discount: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  category?: { name: string } | null;
  sellingPrice: number | string | { toString(): string };
  purchasePrice: number | string | { toString(): string };
  stock: number | string | { toString(): string };
}

export default function PosPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch live products from DB
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products?tenantId=demo-tenant");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setProducts(json.data);
      } else {
        // Fallback demo data if DB is not yet seeded
        setProducts([
          { id: "p1", name: "Miniket Rice 25kg", sku: "RICE-MIN-25", barcode: "89411001", category: { name: "Grocery" }, sellingPrice: 1850, purchasePrice: 1650, stock: 45 },
          { id: "p2", name: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", barcode: "89411002", category: { name: "Grocery" }, sellingPrice: 820, purchasePrice: 760, stock: 30 },
          { id: "p3", name: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", barcode: "89411003", category: { name: "Dairy" }, sellingPrice: 90, purchasePrice: 78, stock: 60 },
          { id: "p4", name: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", barcode: "89411004", category: { name: "Dairy" }, sellingPrice: 840, purchasePrice: 780, stock: 15 },
          { id: "p5", name: "Radhuni Turmeric Powder 200g", sku: "RAD-TUR-200G", barcode: "89411005", category: { name: "Spices" }, sellingPrice: 110, purchasePrice: 92, stock: 50 },
          { id: "p6", name: "Ispahani Mirzapore Tea 400g", sku: "TEA-ISP-400G", barcode: "89411006", category: { name: "Beverage" }, sellingPrice: 220, purchasePrice: 195, stock: 40 },
          { id: "p7", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", barcode: "89411007", category: { name: "Personal Care" }, sellingPrice: 65, purchasePrice: 52, stock: 80 },
          { id: "p8", name: "Parachute Coconut Oil 200ml", sku: "OIL-PAR-200M", barcode: "89411008", category: { name: "Personal Care" }, sellingPrice: 160, purchasePrice: 135, stock: 25 },
        ]);
      }
    } catch (e) {
      console.error("Products load error:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F8") {
        e.preventDefault();
        if (cart.length > 0) openPayModal();
      } else if (e.key === "Escape") {
        setIsPayModalOpen(false);
        setIsReceiptOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product) => {
    const priceNum = Number(product.sellingPrice);
    const costNum = Number(product.purchasePrice);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: priceNum,
          costPrice: costNum,
          quantity: 1,
          discount: 0,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setOverallDiscount(0);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalTax = (subtotal * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal - overallDiscount + totalTax);
  const changeAmount = Math.max(0, (paidAmount || 0) - grandTotal);
  const dueAmount = Math.max(0, grandTotal - (paidAmount || 0));

  const openPayModal = () => {
    setPaidAmount(grandTotal);
    setIsPayModalOpen(true);
  };

  // Live Checkout to API
  const completeSale = async () => {
    setSubmitting(true);
    try {
      const payload = {
        tenantId: "demo-tenant",
        branchId: "DHAKA-MAIN",
        cashierId: "admin@unbeatable.com",
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          costPrice: item.costPrice,
          discount: item.discount,
          taxRate: 0,
          totalPrice: item.price * item.quantity,
        })),
        subtotal,
        discount: overallDiscount,
        tax: totalTax,
        grandTotal,
        paidAmount: paidAmount || grandTotal,
        dueAmount,
        changeAmount,
        payments: [
          {
            method: paymentMethod,
            amount: paidAmount || grandTotal,
          },
        ],
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const invoice = {
        invoiceNo: data.success && data.data?.invoiceNo ? data.data.invoiceNo : `INV-${Date.now().toString().slice(-6)}`,
        date: new Date(),
        items: [...cart],
        subtotal,
        discount: overallDiscount,
        tax: totalTax,
        grandTotal,
        paidAmount: paidAmount || grandTotal,
        changeAmount,
        dueAmount,
        paymentMethod,
      };

      setLastInvoice(invoice);
      setIsPayModalOpen(false);
      setIsReceiptOpen(true);
      clearCart();
      loadProducts(); // Refresh stock counts in background
    } catch (err) {
      console.error("Sale submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));
    const catName = p.category?.name || "General";
    const matchesCat = category === "ALL" || catName === category;
    return matchesSearch && matchesCat;
  });

  const categories = ["ALL", "Grocery", "Dairy", "Spices", "Beverage", "Personal Care"];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" }}>
      {/* LEFT SECTION: Catalog & Search */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", borderRight: "1px solid #cbd5e1" }}>
        {/* Top Header */}
        <div style={{ background: "#ffffff", padding: "12px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/dashboard" style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
              ← Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-dark)" }}>⚡ POS COUNTER</h1>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Main Counter • Live Checkout</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "var(--primary-dark)", borderRadius: 20, padding: 2 }}>
              <LanguageSwitcher isCompact />
            </div>
            <span className="badge badge-success">● Connected</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", background: "#f8fafc", padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
              Press <b>/</b> to search, <b>F8</b> to pay
            </span>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div style={{ background: "#ffffff", padding: "14px 20px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 বারকোড স্ক্যান করুন অথবা প্রোডাক্টের নাম / SKU দিয়ে খুঁজুন (Press '/' to focus)..."
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 15,
                borderRadius: 10,
                border: "2px solid #6366f1",
                outline: "none",
                background: "#f8fafc",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: category === cat ? "var(--primary)" : "#e2e8f0",
                  color: category === cat ? "#ffffff" : "#475569",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, alignContent: "start" }}>
          {filteredProducts.map((p) => {
            const stockNum = Number(p.stock);
            const priceNum = Number(p.sellingPrice);
            return (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 14,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.1s ease, box-shadow 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#818cf8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#64748b" }}>
                      {p.category?.name || "General"}
                    </span>
                    <span style={{ fontSize: 11, color: stockNum < 20 ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
                      Stock: {stockNum}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</h3>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{p.sku}</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 16, color: "var(--primary-dark)" }}>{formatCurrency(priceNum)}</strong>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16 }}>＋</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION: Cart & Checkout */}
      <div style={{ width: 440, background: "#ffffff", display: "flex", flexDirection: "column", height: "100%", boxShadow: "var(--shadow-lg)" }}>
        {/* Cart Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>চলতি কার্ট (Cart Items)</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{cart.length}টি আলাদা পণ্য</span>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} style={{ color: "var(--danger)", background: "none", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              ✕ Clear Cart
            </button>
          )}
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", textAlign: "center" }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>🛒</span>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#475569" }}>কার্ট সম্পূর্ণ খালি</p>
              <span style={{ fontSize: 13 }}>বাম পাশ থেকে প্রোডাক্ট সিলেক্ট করুন বা স্ক্যান করুন</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cart.map((item) => (
                <div key={item.id} style={{ padding: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatCurrency(item.price)} × {item.quantity}</div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "2px 4px" }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>-</button>
                    <span style={{ minWidth: 20, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    <strong style={{ fontSize: 14, color: "var(--text-main)" }}>{formatCurrency(item.price * item.quantity)}</strong>
                    <button onClick={() => removeFromCart(item.id)} style={{ display: "block", color: "#94a3b8", background: "none", border: "none", fontSize: 11, cursor: "pointer", marginLeft: "auto" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout Actions */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
            <span>Subtotal (সাবটোটাল)</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
            <span>Discount (ছাড় ৳)</span>
            <input
              type="number"
              min="0"
              value={overallDiscount || ""}
              onChange={(e) => setOverallDiscount(Number(e.target.value) || 0)}
              placeholder="0.00"
              style={{ width: 80, padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: 4, textAlign: "right", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #cbd5e1", paddingTop: 10, marginTop: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Grand Total (সর্বমোট)</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>{formatCurrency(grandTotal)}</strong>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={openPayModal}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: 16,
              fontWeight: 700,
              justifyContent: "center",
              borderRadius: 10,
              opacity: cart.length === 0 ? 0.6 : 1,
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            ⚡ Pay Now (F8) • {formatCurrency(grandTotal)}
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPayModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#ffffff", borderRadius: 16, width: "100%", maxWidth: 520, padding: 28, boxShadow: "var(--shadow-pos)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>পেমেন্ট গ্রহণ (Payment Checkout)</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>টাকা জমা ও রসিদ তৈরি করুন</span>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ background: "var(--primary-light)", padding: "16px 20px", borderRadius: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--primary-dark)", fontWeight: 600 }}>মোট প্রদেয় টাকা:</span>
              <strong style={{ fontSize: 24, color: "var(--primary-dark)", fontWeight: 800 }}>{formatCurrency(grandTotal)}</strong>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#475569" }}>পেমেন্ট মাধ্যম (Payment Method)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {["CASH", "BKASH", "NAGAD", "CARD", "BANK", "CREDIT"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    style={{
                      padding: "10px 0",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                      border: paymentMethod === m ? "2px solid var(--primary)" : "1px solid #cbd5e1",
                      background: paymentMethod === m ? "var(--primary-light)" : "#ffffff",
                      color: paymentMethod === m ? "var(--primary-dark)" : "#334155",
                      cursor: "pointer",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Received Amount Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#475569" }}>প্রাপ্ত টাকা (Amount Received ৳)</label>
              <input
                type="number"
                value={paidAmount || ""}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                style={{ width: "100%", padding: "12px 14px", fontSize: 18, fontWeight: 700, borderRadius: 8, border: "2px solid #cbd5e1", outline: "none" }}
              />
            </div>

            {/* Change / Due calculations */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#f8fafc", borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              <div>
                <span style={{ color: "#64748b" }}>ফেরত দিতে হবে (Change): </span>
                <strong style={{ color: "#16a34a" }}>{formatCurrency(changeAmount)}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>বকেয়া (Due): </span>
                <strong style={{ color: "#dc2626" }}>{formatCurrency(dueAmount)}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsPayModalOpen(false)} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                বাতিল (Cancel)
              </button>
              <button
                disabled={submitting}
                onClick={completeSale}
                className="btn-primary"
                style={{ flex: 2, justifyContent: "center", padding: "12px 0", fontSize: 15 }}
              >
                {submitting ? "প্রসেস হচ্ছে..." : "✓ সেল সম্পন্ন ও প্রিন্ট করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {isReceiptOpen && lastInvoice && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110 }}>
          <div style={{ background: "#ffffff", borderRadius: 12, width: 380, padding: 24, boxShadow: "var(--shadow-pos)", textAlign: "center" }}>
            <div style={{ borderBottom: "1px dashed #cbd5e1", paddingBottom: 12, marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>UNBEATABLE STORE</h2>
              <p style={{ fontSize: 12, color: "#64748b" }}>Main Branch, Dhaka, Bangladesh</p>
              <p style={{ fontSize: 12, color: "#64748b" }}>Phone: +880 1700-000000</p>
              <p style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Invoice: {lastInvoice.invoiceNo}</p>
            </div>

            <div style={{ textAlign: "left", fontSize: 12, marginBottom: 12 }}>
              {lastInvoice.items.map((it: CartItem) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>{it.name} × {it.quantity}</span>
                  <strong>{formatCurrency(it.price * it.quantity)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 8, fontSize: 13, textAlign: "right", marginBottom: 16 }}>
              <div>Subtotal: {formatCurrency(lastInvoice.subtotal)}</div>
              {lastInvoice.discount > 0 && <div>Discount: -{formatCurrency(lastInvoice.discount)}</div>}
              <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>Grand Total: {formatCurrency(lastInvoice.grandTotal)}</div>
              <div>Paid ({lastInvoice.paymentMethod}): {formatCurrency(lastInvoice.paidAmount)}</div>
              {lastInvoice.changeAmount > 0 && <div>Change Return: {formatCurrency(lastInvoice.changeAmount)}</div>}
            </div>

            <p style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>ধন্যবাদ, আবার আসবেন!</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => window.print()} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                🖨️ Print
              </button>
              <button onClick={() => setIsReceiptOpen(false)} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
