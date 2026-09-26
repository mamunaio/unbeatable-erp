"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  IconPos,
  IconSearch,
  IconTrash,
  IconCheck,
  IconPrint,
  IconPlus,
  IconCustomers,
  IconProducts,
} from "@/components/Icons";

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

  // Customer state in POS
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone: string; points: number }>({
    name: "Walk-in Customer",
    phone: "01700000000",
    points: 0,
  });

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
        // Fallback demo data
        setProducts([
          { id: "p1", name: "Miniket Premium Rice 25kg", sku: "RICE-MIN-25", barcode: "89411001", category: { name: "Grocery" }, sellingPrice: 1850, purchasePrice: 1650, stock: 45 },
          { id: "p2", name: "Rupchanda Soyabean Oil 5L", sku: "OIL-SOY-5L", barcode: "89411002", category: { name: "Grocery" }, sellingPrice: 820, purchasePrice: 760, stock: 30 },
          { id: "p3", name: "Aarong Fresh Milk 1 Litre", sku: "MILK-AAR-1L", barcode: "89411003", category: { name: "Dairy" }, sellingPrice: 90, purchasePrice: 78, stock: 60 },
          { id: "p4", name: "Dano Full Cream Milk 1kg", sku: "MILK-DAN-1KG", barcode: "89411004", category: { name: "Dairy" }, sellingPrice: 840, purchasePrice: 780, stock: 15 },
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
        customer: selectedCustomer,
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
      loadProducts();
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
    <div style={{ display: "flex", height: "100vh", background: "#0b0f19", overflow: "hidden", color: "#f8fafc" }}>
      {/* ========================================================================= */}
      {/* LEFT SECTION: Catalog & Touch Grid */}
      {/* ========================================================================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", borderRight: "1px solid rgba(255, 255, 255, 0.08)" }}>
        {/* Top POS Header */}
        <div
          style={{
            background: "#111827",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/dashboard"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              ← ড্যাশবোর্ড
            </Link>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="brand-badge" style={{ width: 28, height: 28, fontSize: 14 }}>⚡</span>
                <h1 style={{ fontSize: 17, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.3px" }}>
                  UNBEATABLE POS STATION
                </h1>
                <span className="badge badge-success" style={{ fontSize: 11 }}>● Live Online</span>
              </div>
              <span style={{ fontSize: 11.5, color: "#94a3b8" }}>Terminal: #POS-01 • Cashier: Admin</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 140 }}>
              <LanguageSwitcher isCompact />
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ padding: "14px 20px", background: "#111827", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#1f2937",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <IconSearch size={18} color="#818cf8" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="🔍 বারকোড স্ক্যান করুন বা প্রোডাক্ট খুঁজুন... (শর্টকাট: /)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  outline: "none",
                }}
              />
              <kbd style={{ background: "#374151", color: "#9ca3af", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                /
              </kbd>
            </div>
          </div>

          {/* Categories Horizontal Scroller */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 15px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  background: category === cat ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)" : "rgba(255, 255, 255, 0.05)",
                  color: category === cat ? "#ffffff" : "#94a3b8",
                  boxShadow: category === cat ? "0 0 15px rgba(168, 85, 247, 0.45)" : "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                {cat === "ALL" ? "সকল পণ্য" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, background: "#060a14" }}>
          {loadingProducts ? (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
              <p>প্রোডাক্ট ক্যাটালগ লোড হচ্ছে...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>কোনো পণ্য পাওয়া যায়নি!</p>
              <span style={{ fontSize: 13 }}>অন্য কোনো নাম বা বারকোড দিয়ে চেষ্টা করুন</span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {filteredProducts.map((p) => {
                const stockNum = Number(p.stock) || 0;
                const isLowStock = stockNum <= 5;
                return (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    style={{
                      background: "rgba(17, 24, 39, 0.75)",
                      border: "1px solid rgba(255, 255, 255, 0.09)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all var(--transition-fast)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                      position: "relative",
                      overflow: "hidden",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                      e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(168, 85, 247, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.09)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span
                          className="badge"
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            background: isLowStock ? "rgba(244, 63, 94, 0.2)" : "rgba(16, 185, 129, 0.15)",
                            color: isLowStock ? "#f43f5e" : "#10b981",
                            border: `1px solid ${isLowStock ? "rgba(244, 63, 94, 0.4)" : "rgba(16, 185, 129, 0.3)"}`,
                          }}
                        >
                          স্টক: {stockNum}
                        </span>
                        <span style={{ fontSize: 10, color: "#6b7280", fontFamily: "monospace" }}>{p.sku}</span>
                      </div>

                      <strong style={{ fontSize: 13.5, color: "#ffffff", display: "block", lineHeight: 1.3, marginBottom: 8 }}>
                        {p.name}
                      </strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#34d399" }}>
                        {formatCurrency(Number(p.sellingPrice))}
                      </div>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)",
                        }}
                      >
                        ＋
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: Cart & Neon Grand Total Billboard */}
      {/* ========================================================================= */}
      <div
        style={{
          width: 440,
          background: "#111827",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Customer Bar */}
        <div style={{ padding: "12px 18px", background: "#1f2937", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#374151", display: "grid", placeItems: "center" }}>
              <IconCustomers size={16} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{selectedCustomer.name}</div>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{selectedCustomer.phone} • {selectedCustomer.points} pts</span>
            </div>
          </div>
          <button
            onClick={() => {
              const name = prompt("কাস্টমারের নাম লিখুন:", "Rahim Chowdhury");
              if (name) setSelectedCustomer({ name, phone: "01711223344", points: 85 });
            }}
            style={{
              padding: "4px 10px",
              background: "#374151",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "var(--radius-sm)",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            পরিবর্তন
          </button>
        </div>

        {/* Cart Item Rows */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
              <strong style={{ fontSize: 15, color: "#9ca3af", display: "block" }}>কার্ট বর্তমানে খালি</strong>
              <span style={{ fontSize: 12 }}>বাম পাশ থেকে প্রোডাক্ট সিলেক্ট বা স্ক্যান করুন</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#1f2937",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  <div style={{ flex: 1, paddingRight: 10 }}>
                    <strong style={{ fontSize: 13, color: "#ffffff", display: "block", lineHeight: 1.2 }}>
                      {item.name}
                    </strong>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                      {formatCurrency(item.price)} × {item.quantity} = <strong style={{ color: "#10b981" }}>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        border: "1px solid #4b5563",
                        background: "#374151",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ width: 22, textAlign: "center", fontSize: 13, fontWeight: 800 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        border: "1px solid #4b5563",
                        background: "#374151",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: 4,
                        color: "#f43f5e",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculations & Grand Total Billboard */}
        <div style={{ padding: "16px 20px", background: "#1f2937", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>
            <span>সাব-টোটাল ({cart.length} আইটেম):</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>
            <span>ডিসকাউন্ট (৳):</span>
            <input
              type="number"
              min="0"
              value={overallDiscount || ""}
              onChange={(e) => setOverallDiscount(Number(e.target.value) || 0)}
              style={{
                width: 80,
                textAlign: "right",
                padding: "2px 6px",
                borderRadius: 4,
                border: "1px solid #4b5563",
                background: "#111827",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
              }}
            />
          </div>

          {/* Glowing Grand Total Billboard */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.45)",
              borderRadius: "var(--radius-md)",
              padding: "14px 18px",
              marginTop: 10,
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.3)",
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#c7d2fe" }}>
                GRAND TOTAL
              </span>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                {formatCurrency(grandTotal)}
              </div>
            </div>
            <span className="badge" style={{ fontSize: 12, padding: "4px 8px", background: "rgba(99, 102, 241, 0.3)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              F8: Pay
            </span>
          </div>

          {/* Fast Checkout Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid #4b5563",
                background: "#374151",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                opacity: cart.length === 0 ? 0.5 : 1,
              }}
            >
              বাতিল (Esc)
            </button>

            <button
              onClick={openPayModal}
              disabled={cart.length === 0}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: cart.length === 0 ? "#4b5563" : "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: cart.length > 0 ? "0 4px 18px rgba(168, 85, 247, 0.45)" : "none",
              }}
            >
              <IconPos size={18} />
              <span>⚡ বিল কনফার্ম (F8)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT & MULTI-PAYMENT MODAL */}
      {/* ========================================================================= */}
      {isPayModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 15, 25, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "grid",
            placeItems: "center",
            zIndex: 150,
            padding: 16,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              background: "#1f2937",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              padding: 28,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>💵 পেমেন্ট সংগ্রহ (Payment)</h2>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>গ্রাহক: {selectedCustomer.name}</span>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 20, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Total Due Banner */}
            <div style={{ background: "#111827", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 18, textAlign: "center", border: "1px solid #374151" }}>
              <span style={{ fontSize: 12, color: "#9ca3af", textTransform: "uppercase" }}>সর্বমোট প্রদেয় বিল</span>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#34d399", marginTop: 2 }}>
                {formatCurrency(grandTotal)}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>পেমেন্ট মেথড নির্বাচন করুন</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { key: "CASH", label: "💵 ক্যাশ" },
                  { key: "BKASH", label: "🌸 বিকাশ" },
                  { key: "NAGAD", label: "🟠 নগদ" },
                  { key: "CARD", label: "💳 কার্ড" },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key)}
                    style={{
                      padding: "10px 4px",
                      borderRadius: "var(--radius-sm)",
                      border: paymentMethod === m.key ? "2px solid #6366f1" : "1px solid #4b5563",
                      background: paymentMethod === m.key ? "#312e81" : "#111827",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paid Amount & Quick Notes */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                ক্যাশ প্রাপ্তি (Tendered Amount ৳)
              </label>
              <input
                type="number"
                value={paidAmount || ""}
                onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid #6366f1",
                  background: "#111827",
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              />

              {/* Quick Cash Buttons */}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[500, 1000, 2000, grandTotal].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPaidAmount(amt)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: "#374151",
                      border: "1px solid #4b5563",
                      borderRadius: 6,
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {idx === 3 ? "Exact" : `৳${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Change / Due Return */}
            <div style={{ padding: "12px 16px", background: "#111827", borderRadius: "var(--radius-sm)", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                {paidAmount >= grandTotal ? "ফেরতযোগ্য টাকা (Change Return):" : "বাকি থাকবে (Due Balance):"}
              </span>
              <strong style={{ fontSize: 18, color: paidAmount >= grandTotal ? "#34d399" : "#f43f5e" }}>
                {paidAmount >= grandTotal ? formatCurrency(changeAmount) : formatCurrency(dueAmount)}
              </strong>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsPayModalOpen(false)} className="btn-secondary" style={{ background: "#374151", color: "#fff", borderColor: "#4b5563" }}>
                বাতিল
              </button>
              <button
                disabled={submitting}
                onClick={completeSale}
                className="btn-primary"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", padding: "12px 24px", fontSize: 15, boxShadow: "0 4px 18px rgba(168, 85, 247, 0.45)" }}
              >
                {submitting ? "প্রসেসিং..." : "✓ পেমেন্ট কনফার্ম ও প্রিন্ট"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THERMAL PRINT RECEIPT POPUP */}
      {/* ========================================================================= */}
      {isReceiptOpen && lastInvoice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 15, 25, 0.85)",
            backdropFilter: "blur(12px)",
            display: "grid",
            placeItems: "center",
            zIndex: 160,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: 16,
              width: "100%",
              maxWidth: 380,
              padding: 24,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              fontFamily: "monospace",
            }}
          >
            <div style={{ textAlign: "center", borderBottom: "2px dashed #cbd5e1", paddingBottom: 12, marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900 }}>UNBEATABLE RETAIL</h2>
              <p style={{ fontSize: 11, color: "#64748b" }}>Main Branch, Dhanmondi, Dhaka</p>
              <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>Invoice: #{lastInvoice.invoiceNo}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{new Date().toLocaleString()}</div>
            </div>

            <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 12 }}>
              {lastInvoice.items.map((it: any) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{it.name} × {it.quantity}</span>
                  <strong>{formatCurrency(it.price * it.quantity)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 8, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(lastInvoice.subtotal)}</span>
              </div>
              {lastInvoice.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, color: "#dc2626" }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(lastInvoice.discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, marginTop: 4, borderTop: "2px solid #0f172a", paddingTop: 4 }}>
                <span>TOTAL:</span>
                <span>{formatCurrency(lastInvoice.grandTotal)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setIsReceiptOpen(false)} className="btn-secondary" style={{ flex: 1, fontSize: 12 }}>
                Close
              </button>
              <button onClick={() => window.print()} className="btn-primary" style={{ flex: 1, fontSize: 12 }}>
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
