"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";

interface PurchaseItemRow {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNo: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
}

const initialProducts = [
  { id: "p1", name: "Miniket Rice 25kg", sku: "RICE-MIN-25", purchasePrice: 1650, sellingPrice: 1850 },
  { id: "p2", name: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", purchasePrice: 760, sellingPrice: 820 },
  { id: "p3", name: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", purchasePrice: 78, sellingPrice: 90 },
  { id: "p4", name: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", purchasePrice: 780, sellingPrice: 840 },
  { id: "p5", name: "LUX Beauty Soap 100g", sku: "SOAP-LUX-100G", purchasePrice: 52, sellingPrice: 65 },
  { id: "p6", name: "Radhuni Turmeric Powder 200g", sku: "RAD-TUR-200G", purchasePrice: 92, sellingPrice: 110 },
];

const initialSuppliers = [
  { id: "sup-1", name: "Meghna Group of Industries Ltd", due: 35000 },
  { id: "sup-2", name: "ACI Consumer Brands Ltd", due: 18500 },
  { id: "sup-3", name: "Square Toiletries Ltd", due: 0 },
  { id: "sup-4", name: "Pran-RFL Foods Ltd", due: 12400 },
];

export default function NewPurchasePage() {
  const router = useRouter();

  const [supplierId, setSupplierId] = useState("sup-1");
  const [invoiceNo, setInvoiceNo] = useState(`PO-${Date.now().toString().slice(-6)}`);
  const [supplierChallanNo, setSupplierChallanNo] = useState("CHAL-2026-9921");
  const [purchaseDate, setPurchaseDate] = useState("2026-09-25");
  const [warehouse, setWarehouse] = useState("Dhaka Main Store");

  const [items, setItems] = useState<PurchaseItemRow[]>([
    {
      id: "row-1",
      productId: "p1",
      productName: "Miniket Rice 25kg",
      sku: "RICE-MIN-25",
      batchNo: "LOT-2026-09A",
      expiryDate: "2027-09-30",
      purchasePrice: 1650,
      sellingPrice: 1850,
      quantity: 20,
    },
    {
      id: "row-2",
      productId: "p2",
      productName: "Soyabean Oil 5 Litre",
      sku: "OIL-SOY-5L",
      batchNo: "LOT-2026-09B",
      expiryDate: "2027-03-31",
      purchasePrice: 760,
      sellingPrice: 820,
      quantity: 15,
    },
  ]);

  const [shippingCost, setShippingCost] = useState<number>(500);
  const [supplierDiscount, setSupplierDiscount] = useState<number>(400);
  const [paidAmount, setPaidAmount] = useState<number>(40000);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Row Calculation
  const subtotal = items.reduce((sum, item) => sum + item.purchasePrice * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal + shippingCost - supplierDiscount);
  const balanceDue = Math.max(0, grandTotal - paidAmount);

  // Add Product Row
  const handleAddRow = () => {
    const defaultProduct = initialProducts[0];
    const newRow: PurchaseItemRow = {
      id: `row-${Date.now()}`,
      productId: defaultProduct.id,
      productName: defaultProduct.name,
      sku: defaultProduct.sku,
      batchNo: `LOT-${Date.now().toString().slice(-4)}`,
      expiryDate: "",
      purchasePrice: defaultProduct.purchasePrice,
      sellingPrice: defaultProduct.sellingPrice,
      quantity: 10,
    };
    setItems([...items, newRow]);
  };

  // Remove Row
  const handleRemoveRow = (id: string) => {
    if (items.length <= 1) {
      alert("অন্তত একটি পণ্যের এন্ট্রি থাকতে হবে!");
      return;
    }
    setItems(items.filter((it) => it.id !== id));
  };

  // Update Row
  const handleUpdateRow = (id: string, field: keyof PurchaseItemRow, value: any) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          if (field === "productId") {
            const selectedProd = initialProducts.find((p) => p.id === value);
            if (selectedProd) {
              return {
                ...it,
                productId: selectedProd.id,
                productName: selectedProd.name,
                sku: selectedProd.sku,
                purchasePrice: selectedProd.purchasePrice,
                sellingPrice: selectedProd.sellingPrice,
              };
            }
          }
          return { ...it, [field]: value };
        }
        return it;
      })
    );
  };

  // Submit Purchase
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("চালানে কোনো পণ্য যোগ করা হয়নি!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert(`✓ পারচেজ চালান ${invoiceNo} সফলভাবে সংরক্ষিত হয়েছে এবং স্টক বৃদ্ধি করা হয়েছে!`);
      router.push("/purchases");
    }, 600);
  };

  const selectedSupplier = initialSuppliers.find((s) => s.id === supplierId);

  return (
    <main className="page-container" style={{ maxWidth: 1080 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <Link href="/purchases" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← পারচেজ তালিকায় ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🛒 নতুন পারচেজ চালান ও স্টক ইনওয়ার্ড এন্ট্রি</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            সাপ্লায়ারের মাল্টি-আইটেম চালান, ব্যাচ নম্বর ও ক্রয়মূল্য এন্ট্রি দিয়ে তাৎক্ষণিক স্টক বৃদ্ধি করুন।
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Info Grid */}
        <div className="card" style={{ marginBottom: 20, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                সাপ্লায়ার / মহাজন নির্বাচন করুন *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
              >
                {initialSuppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (বকেয়া: {formatCurrency(s.due)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                সিস্টেম PO নম্বর
              </label>
              <input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                সাপ্লায়ার চালান নং (Challan) *
              </label>
              <input
                required
                value={supplierChallanNo}
                onChange={(e) => setSupplierChallanNo(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                চালানের তারিখ *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
              />
            </div>
          </div>
        </div>

        {/* Multi-Item Table */}
        <div className="table-container" style={{ marginBottom: 20 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>চালানের অন্তর্ভুক্ত পণ্যসমূহ (Items List)</h2>
            <button type="button" onClick={handleAddRow} className="btn-secondary" style={{ padding: "5px 12px", fontSize: 12 }}>
              ＋ আরও পণ্য যোগ করুন
            </button>
          </div>

          <table className="erp-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ width: 220 }}>পণ্য নির্বাচন করুন</th>
                <th>ব্যাচ / লট নং</th>
                <th>মেয়াদ (Expiry)</th>
                <th>কেনা দর (৳)</th>
                <th>বিক্রয় মূল্য (৳)</th>
                <th style={{ width: 90 }}>পরিমাণ</th>
                <th style={{ textAlign: "right" }}>মোট মূল্য</th>
                <th style={{ textAlign: "center", width: 50 }}>মুছুন</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td>
                    <select
                      value={row.productId}
                      onChange={(e) => handleUpdateRow(row.id, "productId", e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-color)", fontWeight: 600 }}
                    >
                      {initialProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      placeholder="LOT-No"
                      value={row.batchNo}
                      onChange={(e) => handleUpdateRow(row.id, "batchNo", e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-color)", fontFamily: "monospace" }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.expiryDate}
                      onChange={(e) => handleUpdateRow(row.id, "expiryDate", e.target.value)}
                      style={{ width: "100%", padding: "6px 6px", borderRadius: 4, border: "1px solid var(--border-color)" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={row.purchasePrice}
                      onChange={(e) => handleUpdateRow(row.id, "purchasePrice", Number(e.target.value) || 0)}
                      style={{ width: 90, padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-color)", fontWeight: 700 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={row.sellingPrice}
                      onChange={(e) => handleUpdateRow(row.id, "sellingPrice", Number(e.target.value) || 0)}
                      style={{ width: 90, padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-color)" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleUpdateRow(row.id, "quantity", Number(e.target.value) || 0)}
                      style={{ width: 80, padding: "6px 8px", borderRadius: 4, border: "1px solid var(--border-color)", fontWeight: 700 }}
                    />
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 800, color: "var(--primary-dark)" }}>
                    {formatCurrency(row.purchasePrice * row.quantity)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 16 }}
                      title="আইটেম মুছুন"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Calculations & Payment Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 24 }}>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>পেমেন্ট ও লেজার নিষ্পত্তি (Payment Details)</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>পেমেন্ট মাধ্যম</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                >
                  <option value="BANK_TRANSFER">Bank EFT / Cheque (ব্যাংক একাউন্ট)</option>
                  <option value="CASH">Cash in Hand (নগদ ক্যাশ)</option>
                  <option value="BKASH">bKash Merchant</option>
                  <option value="CREDIT">সম্পূর্ণ বাকি (Full Credit Due)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>তাৎক্ষণিক পরিশোধিত টাকা (Paid ৳)</label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>নোট / চালানের মন্তব্য</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: ট্রাক আনলোডিং খরচ চালানে যুক্ত আছে"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", outline: "none", fontSize: 13 }}
              />
            </div>
          </div>

          {/* Bill Breakdown Box */}
          <div className="card" style={{ padding: 18, background: "var(--bg-subtle)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>চালান বিলের সারাংশ (Invoice Summary)</h3>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
              <span>আইটেম মোট সাব-টোটাল ({items.length}টি আইটেম):</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontSize: 13 }}>
              <span>পরিবহন ও আনলোডিং খরচ (+):</span>
              <input
                type="number"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value) || 0)}
                style={{ width: 90, padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border-color)", textAlign: "right", fontWeight: 700 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontSize: 13, color: "var(--danger)" }}>
              <span>সাপ্লায়ার বিশেষ ছাড় (-):</span>
              <input
                type="number"
                min="0"
                value={supplierDiscount}
                onChange={(e) => setSupplierDiscount(Number(e.target.value) || 0)}
                style={{ width: 90, padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border-color)", textAlign: "right", fontWeight: 700 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid var(--border-color)", borderBottom: "2px solid var(--border-color)", marginTop: 8, marginBottom: 8, fontSize: 16, fontWeight: 900, color: "var(--primary-dark)" }}>
              <span>সর্বমোট প্রদেয় চালান বিল:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "var(--success)" }}>
              <span>পরিশোধিত টাকা (Paid):</span>
              <strong>{formatCurrency(paidAmount)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14, color: balanceDue > 0 ? "var(--danger)" : "var(--text-main)", fontWeight: 800 }}>
              <span>সাপ্লায়ারের বকেয়া (Due Added):</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Link href="/purchases" className="btn-secondary">
            বাতিল
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "10px 24px", fontSize: 15 }}>
            {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "✓ চালান সেভ ও স্টক বৃদ্ধি করুন (Submit & Inward)"}
          </button>
        </div>
      </form>
    </main>
  );
}
