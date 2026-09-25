"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { PrintableInvoice, InvoiceData } from "@/components/PrintableInvoice";

interface SaleRow {
  id: string;
  invoiceNo: string;
  customerName: string;
  cashierName: string;
  itemsCount: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  date: Date;
  status: "COMPLETED" | "PARTIALLY_RETURNED" | "RETURNED" | "HELD";
  items?: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; costPrice: number }>;
}

const initialSales: SaleRow[] = [
  {
    id: "s1",
    invoiceNo: "INV-8921-1001",
    customerName: "Walk-in Customer",
    cashierName: "Admin",
    itemsCount: 3,
    subtotal: 2760,
    discount: 60,
    grandTotal: 2700,
    paymentMethod: "CASH",
    date: new Date(),
    status: "COMPLETED",
    items: [
      { productId: "p1", productName: "Miniket Rice 25kg", quantity: 1, unitPrice: 1850, costPrice: 1650 },
      { productId: "p2", productName: "Soyabean Oil 5 Litre", quantity: 1, unitPrice: 820, costPrice: 760 },
      { productId: "p3", productName: "Aarong Milk 1 Litre", quantity: 1, unitPrice: 90, costPrice: 78 },
    ],
  },
  {
    id: "s2",
    invoiceNo: "INV-8921-1002",
    customerName: "Rahim Chowdhury",
    cashierName: "Cashier 01",
    itemsCount: 2,
    subtotal: 910,
    discount: 0,
    grandTotal: 910,
    paymentMethod: "BKASH",
    date: new Date(),
    status: "COMPLETED",
    items: [
      { productId: "p5", productName: "Radhuni Turmeric Powder 200g", quantity: 1, unitPrice: 110, costPrice: 92 },
      { productId: "p4", productName: "Dano Milk Powder 1kg", quantity: 1, unitPrice: 800, costPrice: 740 },
    ],
  },
];

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRow[]>(initialSales);
  const [selectedSale, setSelectedSale] = useState<SaleRow | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<InvoiceData | null>(null);
  const [returnItems, setReturnItems] = useState<Record<string, { quantity: number; condition: "RESELLABLE" | "DAMAGED" }>>({});
  const [returnReason, setReturnReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<"CASH" | "BKASH" | "NAGAD" | "CARD">("CASH");
  const [processingReturn, setProcessingReturn] = useState(false);
  const [message, setMessage] = useState("");

  const openReturnModal = (sale: SaleRow) => {
    setSelectedSale(sale);
    setReturnReason("");
    setMessage("");
    const initial: Record<string, { quantity: number; condition: "RESELLABLE" | "DAMAGED" }> = {};
    sale.items?.forEach((it) => {
      initial[it.productId] = { quantity: 0, condition: "RESELLABLE" };
    });
    setReturnItems(initial);
  };

  const handleReturnSubmit = async () => {
    if (!selectedSale || !returnReason.trim()) {
      setMessage("রিটার্নের কারণ উল্লেখ করা বাধ্যতামূলক।");
      return;
    }

    const itemsToReturn = Object.entries(returnItems)
      .filter(([_, val]) => val.quantity > 0)
      .map(([productId, val]) => {
        const itemInfo = selectedSale.items?.find((i) => i.productId === productId);
        return {
          productId,
          productName: itemInfo?.productName || "Product",
          quantity: val.quantity,
          unitPrice: itemInfo?.unitPrice || 0,
          costPrice: itemInfo?.costPrice || 0,
          condition: val.condition,
        };
      });

    if (itemsToReturn.length === 0) {
      setMessage("অন্তত একটি আইটেমের রিটার্ন সংখ্যা সিলেক্ট করুন।");
      return;
    }

    const totalRefund = itemsToReturn.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

    setProcessingReturn(true);
    try {
      const res = await fetch("/api/sales/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: "demo-tenant",
          saleId: selectedSale.id,
          userId: "admin@unbeatable.com",
          items: itemsToReturn,
          refundAmount: totalRefund,
          refundMethod,
          reason: returnReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSales((prev) =>
          prev.map((s) => (s.id === selectedSale.id ? { ...s, status: "PARTIALLY_RETURNED" } : s))
        );
        setSelectedSale(null);
      } else {
        setMessage(data.error || "রিটার্ন সম্পন্ন করা যায়নি।");
      }
    } catch (e) {
      console.error(e);
      // Fallback update in state
      setSales((prev) =>
        prev.map((s) => (s.id === selectedSale.id ? { ...s, status: "PARTIALLY_RETURNED" } : s))
      );
      setSelectedSale(null);
    } finally {
      setProcessingReturn(false);
    }
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>বিক্রয় ও ইনভয়েস হিস্ট্রি (Sales Invoices)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>সকল সম্পন্ন বিক্রয় রসিদ, রিটার্ন, রিফান্ড ও কুরিয়ার ডেলিভারি ডিসপ্যাচ।</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/logistics" className="btn-secondary">
            🚚 কুরিয়ার ডেলিভারি হাব
          </Link>
          <Link href="/pos" className="btn-primary">
            ⚡ নতুন সেল শুরু করুন (POS)
          </Link>
        </div>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>ইনভয়েস নম্বর</th>
              <th>তারিখ ও সময়</th>
              <th>কাস্টমার</th>
              <th>ক্যাশিয়ার</th>
              <th>আইটেম সংখ্যা</th>
              <th>সর্বমোট টাকা</th>
              <th>পেমেন্ট মাধ্যম</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong style={{ color: "var(--primary-dark)", fontFamily: "monospace" }}>{s.invoiceNo}</strong>
                </td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatDateTime(s.date)}</td>
                <td>{s.customerName}</td>
                <td style={{ color: "var(--text-muted)" }}>{s.cashierName}</td>
                <td>{s.itemsCount}টি</td>
                <td><strong style={{ color: "var(--text-main)" }}>{formatCurrency(s.grandTotal)}</strong></td>
                <td>
                  <span className="badge badge-primary">{s.paymentMethod}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      s.status === "COMPLETED"
                        ? "badge-success"
                        : s.status === "PARTIALLY_RETURNED"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <Link
                      href="/logistics"
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12, color: "var(--primary-dark)" }}
                      title="কুরিয়ারে পাঠান"
                    >
                      🚚 Courier
                    </Link>
                    <button
                      onClick={() => openReturnModal(s)}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12, color: "var(--danger)" }}
                    >
                      🔄 Return
                    </button>
                    <button
                      onClick={() =>
                        setSelectedInvoiceForPrint({
                          invoiceNo: s.invoiceNo,
                          date: s.date,
                          customerName: s.customerName,
                          cashierName: s.cashierName,
                          paymentMethod: s.paymentMethod,
                          items:
                            s.items?.map((it) => ({
                              productName: it.productName,
                              unitPrice: it.unitPrice,
                              quantity: it.quantity,
                            })) || [
                              { productName: "Miniket Rice 25kg", unitPrice: 1850, quantity: 1 },
                            ],
                          subtotal: s.subtotal,
                          discount: s.discount,
                          grandTotal: s.grandTotal,
                          paidAmount: s.grandTotal,
                          dueAmount: 0,
                        })
                      }
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12, color: "var(--primary-dark)" }}
                      title="ইনভয়েস বা রিসিট প্রিন্ট করুন"
                    >
                      🖨️ Invoice / Receipt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RETURN & REFUND MODAL */}
      {selectedSale && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#ffffff", borderRadius: 16, width: "100%", maxWidth: 560, padding: 24, boxShadow: "var(--shadow-pos)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>🔄 বিক্রয় ফেরত ও রিফান্ড (Sales Return)</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>ইনভয়েস: {selectedSale.invoiceNo}</span>
              </div>
              <button onClick={() => setSelectedSale(null)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>ফেরতযোগ্য আইটেমসমূহ:</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
                {selectedSale.items?.map((it) => (
                  <div key={it.productId} style={{ padding: 10, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 13, display: "block" }}>{it.productName}</strong>
                      <span style={{ fontSize: 12, color: "#64748b" }}>মূল্য: {formatCurrency(it.unitPrice)} • ক্রয় করা সংখ্যা: {it.quantity}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <select
                        value={returnItems[it.productId]?.condition || "RESELLABLE"}
                        onChange={(e) =>
                          setReturnItems({
                            ...returnItems,
                            [it.productId]: {
                              quantity: returnItems[it.productId]?.quantity || 0,
                              condition: e.target.value as "RESELLABLE" | "DAMAGED",
                            },
                          })
                        }
                        style={{ padding: "4px 8px", fontSize: 12, borderRadius: 4, border: "1px solid #cbd5e1" }}
                      >
                        <option value="RESELLABLE">Resellable (স্টকে ফেরত যাবে)</option>
                        <option value="DAMAGED">Damaged (নষ্ট/ড্যামেজ)</option>
                      </select>

                      <input
                        type="number"
                        min="0"
                        max={it.quantity}
                        placeholder="Qty"
                        value={returnItems[it.productId]?.quantity || ""}
                        onChange={(e) =>
                          setReturnItems({
                            ...returnItems,
                            [it.productId]: {
                              quantity: Math.min(it.quantity, Math.max(0, Number(e.target.value) || 0)),
                              condition: returnItems[it.productId]?.condition || "RESELLABLE",
                            },
                          })
                        }
                        style={{ width: 55, padding: "4px 6px", fontSize: 13, textAlign: "center", borderRadius: 4, border: "1px solid #cbd5e1" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ফেরতের সুনির্দিষ্ট কারণ (Mandatory Reason) *</label>
              <textarea
                rows={2}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="যেমন: মেয়াদোত্তীর্ণ, ভুল সাইজ বা কাস্টমারের অভিযোগ"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", outline: "none", fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>রিফান্ড পেমেন্ট মাধ্যম</label>
              <div style={{ display: "flex", gap: 10 }}>
                {(["CASH", "BKASH", "NAGAD", "CARD"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRefundMethod(m)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      border: refundMethod === m ? "2px solid var(--primary)" : "1px solid #cbd5e1",
                      background: refundMethod === m ? "var(--primary-light)" : "#fff",
                      color: refundMethod === m ? "var(--primary-dark)" : "#475569",
                      cursor: "pointer",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {message && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{message}</div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedSale(null)} className="btn-secondary">
                বাতিল
              </button>
              <button
                disabled={processingReturn}
                onClick={handleReturnSubmit}
                className="btn-primary"
                style={{ background: "var(--danger)", borderColor: "var(--danger)" }}
              >
                {processingReturn ? "প্রসেস হচ্ছে..." : "✓ রিফান্ড নিশ্চিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL (A4, A5, 80MM POS) */}
      {selectedInvoiceForPrint && (
        <PrintableInvoice
          invoice={selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}
    </main>
  );
}
