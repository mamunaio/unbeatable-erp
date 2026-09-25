"use client";

import { useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

export interface InvoiceItem {
  productId?: string;
  productName: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  discount?: number;
  totalPrice?: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: Date | string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  cashierName: string;
  counterName?: string;
  branchName?: string;
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount?: number;
  changeAmount?: number;
  notes?: string;
}

interface PrintableInvoiceProps {
  invoice: InvoiceData;
  onClose?: () => void;
}

export function PrintableInvoice({ invoice, onClose }: PrintableInvoiceProps) {
  const [printFormat, setPrintFormat] = useState<"A4" | "A5" | "THERMAL_80MM">("A4");

  const subtotal = invoice.subtotal || invoice.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const discount = invoice.discount || 0;
  const tax = invoice.tax || 0;
  const grandTotal = invoice.grandTotal || subtotal - discount + tax;
  const paid = invoice.paidAmount || grandTotal;
  const change = invoice.changeAmount || Math.max(0, paid - grandTotal);
  const due = invoice.dueAmount || Math.max(0, grandTotal - paid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" style={{ overflowY: "auto", padding: "20px 10px" }}>
      <div
        className="modal-content"
        style={{
          maxWidth: printFormat === "THERMAL_80MM" ? 380 : printFormat === "A5" ? 640 : 820,
          width: "100%",
          padding: 0,
          background: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Controls Toolbar (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            background: "#1e293b",
            color: "#ffffff",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>🖨️ প্রিন্ট ফরম্যাট:</span>
            <div style={{ display: "flex", gap: 6 }}>
              {(["A4", "A5", "THERMAL_80MM"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setPrintFormat(fmt)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    background: printFormat === fmt ? "var(--primary)" : "rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                  }}
                >
                  {fmt === "A4" ? "📄 A4 সাইজ" : fmt === "A5" ? "📑 A5 হাফ পেজ" : "🧾 ৮০মিমি থার্মাল POS"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handlePrint} className="btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>
              🖨️ প্রিন্ট করুন
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: 13, background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", borderColor: "transparent" }}
              >
                ✕ বন্ধ করুন
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. THERMAL 80MM RECEIPT FORMAT */}
        {/* ========================================================================= */}
        {printFormat === "THERMAL_80MM" ? (
          <div
            style={{
              padding: "24px 18px",
              fontFamily: "monospace",
              fontSize: 12,
              lineHeight: 1.4,
              color: "#000000",
              background: "#ffffff",
            }}
          >
            <div style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: 10, marginBottom: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>UNBEATABLE ERP</h2>
              <p style={{ margin: "2px 0", fontSize: 11 }}>উত্তরা মডেল টাউন, ঢাকা-১২৩০</p>
              <p style={{ margin: "2px 0", fontSize: 11 }}>হটলাইন: ০১৭১১-২২৩৩৪৪ • BIN: 002918239-0101</p>
              <strong style={{ display: "block", marginTop: 6, fontSize: 13 }}>ক্যাশ মেমো / বিক্রয় রশিদ</strong>
            </div>

            <div style={{ fontSize: 11, borderBottom: "1px dashed #000", paddingBottom: 8, marginBottom: 8 }}>
              <div>ইনভয়েস নং: <b>{invoice.invoiceNo}</b></div>
              <div>তারিখ ও সময়: {formatDateTime(invoice.date)}</div>
              <div>কাস্টমার: {invoice.customerName} {invoice.customerPhone ? `(${invoice.customerPhone})` : ""}</div>
              <div>ক্যাশিয়ার: {invoice.cashierName} • কাউন্টার: {invoice.counterName || "Counter 01"}</div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 8 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #000", textAlign: "left" }}>
                  <th style={{ padding: "4px 0" }}>আইটেম</th>
                  <th style={{ textAlign: "center" }}>পরিমাণ</th>
                  <th style={{ textAlign: "right" }}>দর</th>
                  <th style={{ textAlign: "right" }}>মোট</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px dotted #ccc" }}>
                    <td style={{ padding: "4px 0" }}>{item.productName}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ textAlign: "right" }}>{formatCurrency(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: "1px dashed #000", paddingTop: 6, fontSize: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                <span>সাব-টোটাল:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                  <span>ছাড় (Discount):</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              {tax > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                  <span>ভ্যাট ও ট্যাক্স:</span>
                  <span>+ {formatCurrency(tax)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #000", borderBottom: "1px solid #000", fontWeight: 900, fontSize: 14 }}>
                <span>সর্বমোট বিল:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", marginTop: 4 }}>
                <span>পরিশোধিত ({invoice.paymentMethod}):</span>
                <span>{formatCurrency(paid)}</span>
              </div>
              {change > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                  <span>ফেরত টাকা (Change):</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              )}
              {due > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", color: "red", fontWeight: 700 }}>
                  <span>বকেয়া (Due Amount):</span>
                  <span>{formatCurrency(due)}</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: 16, borderTop: "1px dashed #000", paddingTop: 10, fontSize: 10 }}>
              <p style={{ margin: 0 }}>ধন্যবাদ, আবার আসবেন!</p>
              <p style={{ margin: "2px 0" }}>সফটওয়্যার: Unbeatable Retail ERP</p>
              <div style={{ marginTop: 6, letterSpacing: 3, fontWeight: 900, fontSize: 14 }}>
                ||| || ||| |||| ||
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. FORMAL A4 / A5 TAX INVOICE FORMAT */
          /* ========================================================================= */
          <div
            style={{
              padding: printFormat === "A5" ? "24px" : "36px 40px",
              fontFamily: "var(--font-sans, sans-serif)",
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            {/* Header with Branding & VAT Info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0f172a", paddingBottom: 18, marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#4f46e5", color: "#fff", borderRadius: 8, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20 }}>
                    U
                  </div>
                  <div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: "#1e1b4b" }}>UNBEATABLE SUPER STORE</h1>
                    <span style={{ fontSize: 12, color: "#64748b" }}>রেজিস্টার্ড রিটেইল ও হোলসেল আউটলেট</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 8, lineHeight: 1.4 }}>
                  <div>📍 সেক্টর ৭, রোড ৪, উত্তরা মডেল টাউন, ঢাকা-১২৩০</div>
                  <div>📞 হটলাইন: +৮৮০ ১৭১১-২২৩৩৪৪ • ✉️ sales@unbeatable-erp.com</div>
                  <div>🏛️ <b>BIN / ভ্যাট নিবন্ধন নং:</b> ০০২৯১৮২৩৯-০১০১</div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", background: "#eef2ff", color: "#4338ca", padding: "4px 12px", borderRadius: 6, fontWeight: 800, fontSize: 14, marginBottom: 6, border: "1px solid #c7d2fe" }}>
                  ট্যাক্স ইনভয়েস / বিক্রয় চালান
                </span>
                <div style={{ fontSize: 13 }}>
                  <div>ইনভয়েস নং: <strong style={{ color: "#4f46e5", fontFamily: "monospace" }}>{invoice.invoiceNo}</strong></div>
                  <div>তারিখ: <strong>{formatDateTime(invoice.date)}</strong></div>
                  <div>শাখা: <strong>{invoice.branchName || "ঢাকা মেইন ব্রাঞ্চ"}</strong></div>
                </div>
              </div>
            </div>

            {/* Bill To & Cashier Meta */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, background: "#f8fafc", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20, fontSize: 13 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  গ্রাহকের তথ্য (BILL TO):
                </span>
                <strong style={{ fontSize: 14, color: "#0f172a" }}>{invoice.customerName}</strong>
                {invoice.customerPhone && <div style={{ color: "#475569" }}>📞 {invoice.customerPhone}</div>}
                {invoice.customerAddress && <div style={{ color: "#475569" }}>📍 {invoice.customerAddress}</div>}
              </div>

              <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  পেমেন্ট ও কাউন্টার বিবরণ:
                </span>
                <div>পেমেন্ট মাধ্যম: <strong>{invoice.paymentMethod}</strong></div>
                <div>ক্যাশিয়ার: <strong>{invoice.cashierName}</strong></div>
                <div>কাউন্টার নং: <strong>{invoice.counterName || "Counter 01"}</strong></div>
              </div>
            </div>

            {/* Itemized Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#1e293b", color: "#ffffff", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", width: 40 }}>নং</th>
                  <th style={{ padding: "8px 10px" }}>পণ্যের বিবরণ (Item Description)</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>একক মূল্য</th>
                  <th style={{ padding: "8px 10px", textAlign: "center" }}>পরিমাণ</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>মোট টাকা (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", background: idx % 2 === 0 ? "#ffffff" : "#fbfcfe" }}>
                    <td style={{ padding: "8px 10px", color: "#64748b" }}>{idx + 1}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <strong style={{ display: "block", color: "#1e293b" }}>{item.productName}</strong>
                      {item.sku && <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>SKU: {item.sku}</span>}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700 }}>{item.quantity}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary & In Words */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 6, border: "1px solid #e2e8f0", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block" }}>টাকা কথায় (IN WORDS):</span>
                  <strong style={{ fontSize: 13, color: "#1e293b" }}>{formatCurrency(grandTotal)} মাত্র</strong>
                </div>

                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                  <strong style={{ color: "#334155" }}>শর্তাবলী ও রিটার্ন পলিসি:</strong>
                  <div>১. ক্যাশ মেমো ব্যতীত কোনো পণ্য পরিবর্তন বা ফেরত গ্রহণ করা হবে না।</div>
                  <div>২. ক্রয়কৃত পণ্য ৭ দিনের মধ্যে অক্ষত অবস্থায় পরিবর্তনযোগ্য।</div>
                  <div>৩. এটি একটি কম্পিউটার জেনারেটেড ইনভয়েস, কোনো সীল বা স্বাক্ষরের বাধ্যবাধকতা নেই।</div>
                </div>
              </div>

              {/* Total Calculation Box */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 14, background: "#ffffff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>সাব-টোটাল (Subtotal):</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#dc2626" }}>
                    <span>বিশেষ ছাড় (Discount):</span>
                    <strong>- {formatCurrency(discount)}</strong>
                  </div>
                )}

                {tax > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#475569" }}>
                    <span>ভ্যাট ও কর (VAT/Tax):</span>
                    <strong>+ {formatCurrency(tax)}</strong>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #0f172a", borderBottom: "2px solid #0f172a", marginTop: 6, marginBottom: 6, fontSize: 16, fontWeight: 900, color: "#4338ca" }}>
                  <span>সর্বমোট বিল (Net Payable):</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>পরিশোধিত টাকা (Paid):</span>
                  <strong style={{ color: "#16a34a" }}>{formatCurrency(paid)}</strong>
                </div>

                {change > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>ফেরত টাকা (Change):</span>
                    <strong>{formatCurrency(change)}</strong>
                  </div>
                )}

                {due > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#dc2626", fontWeight: 800 }}>
                    <span>বকেয়া (Due Amount):</span>
                    <span>{formatCurrency(due)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Signatures */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 16, borderTop: "1px dashed #cbd5e1", fontSize: 12, color: "#475569" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 140, borderBottom: "1px solid #94a3b8", marginBottom: 4 }} />
                <span>গ্রাহকের স্বাক্ষর (Customer)</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 140, borderBottom: "1px solid #94a3b8", marginBottom: 4 }} />
                <span>কর্তৃপক্ষের স্বাক্ষর (Authorized)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
