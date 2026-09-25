"use client";

import { use } from "react";
import Link from "next/link";
import { PrintableInvoice, InvoiceData } from "@/components/PrintableInvoice";

// Demo invoices dictionary for direct lookup
const demoInvoices: Record<string, InvoiceData> = {
  "INV-8921-1001": {
    invoiceNo: "INV-8921-1001",
    date: new Date("2026-09-25T14:30:00"),
    customerName: "Walk-in Customer",
    customerPhone: "01711-223344",
    customerAddress: "Sector 7, Uttara, Dhaka",
    cashierName: "Admin User",
    counterName: "Counter 01",
    branchName: "Dhaka Main Branch",
    paymentMethod: "CASH",
    items: [
      { productId: "p1", productName: "Miniket Rice 25kg", sku: "RICE-MIN-25", unitPrice: 1850, quantity: 1 },
      { productId: "p2", productName: "Soyabean Oil 5 Litre", sku: "OIL-SOY-5L", unitPrice: 820, quantity: 1 },
      { productId: "p3", productName: "Aarong Milk 1 Litre", sku: "MILK-AAR-1L", unitPrice: 90, quantity: 1 },
    ],
    subtotal: 2760,
    discount: 60,
    grandTotal: 2700,
    paidAmount: 3000,
    changeAmount: 300,
    dueAmount: 0,
  },
  "INV-8921-1002": {
    invoiceNo: "INV-8921-1002",
    date: new Date("2026-09-25T16:15:00"),
    customerName: "Rahim Chowdhury",
    customerPhone: "01819-876543",
    customerAddress: "Dhanmondi, Dhaka",
    cashierName: "Cashier 01",
    counterName: "Counter 02",
    branchName: "Dhaka Main Branch",
    paymentMethod: "BKASH",
    items: [
      { productId: "p5", productName: "Radhuni Turmeric Powder 200g", sku: "RAD-TUR-200G", unitPrice: 110, quantity: 1 },
      { productId: "p4", productName: "Dano Milk Powder 1kg", sku: "MILK-DAN-1KG", unitPrice: 800, quantity: 1 },
    ],
    subtotal: 910,
    discount: 0,
    grandTotal: 910,
    paidAmount: 910,
    changeAmount: 0,
    dueAmount: 0,
  },
};

export default function SalesInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceId = decodeURIComponent(resolvedParams.id);

  const invoiceData: InvoiceData = demoInvoices[invoiceId] || {
    invoiceNo: invoiceId,
    date: new Date(),
    customerName: "Walk-in Customer",
    customerPhone: "017XXXXXXXX",
    cashierName: "Admin User",
    counterName: "Counter 01",
    branchName: "Dhaka Main Branch",
    paymentMethod: "CASH",
    items: [
      { productName: "Miniket Rice 25kg", unitPrice: 1850, quantity: 1 },
      { productName: "Soyabean Oil 5 Litre", unitPrice: 820, quantity: 1 },
    ],
    subtotal: 2670,
    discount: 0,
    grandTotal: 2670,
    paidAmount: 2670,
    dueAmount: 0,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "20px 0" }}>
      <div className="no-print" style={{ maxWidth: 820, margin: "0 auto 16px auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
        <Link href="/sales" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
          ← বিক্রয় ও ইনভয়েস তালিকায় ফিরে যান
        </Link>
      </div>
      <PrintableInvoice invoice={invoiceData} />
    </div>
  );
}
