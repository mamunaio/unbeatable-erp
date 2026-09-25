"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

interface AuditLogRow {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  role: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}

const demoAuditLogs: AuditLogRow[] = [
  {
    id: "log-1",
    action: "CREATE_SALE",
    entity: "Sale",
    entityId: "INV-8921-1001",
    actor: "Admin User",
    role: "OWNER",
    details: JSON.stringify({ invoiceNo: "INV-8921-1001", grandTotal: 2700, itemsCount: 3 }),
    ipAddress: "192.168.0.104",
    createdAt: new Date(),
  },
  {
    id: "log-2",
    action: "CUSTOMER_DUE_PAYMENT",
    entity: "Payment",
    entityId: "pay-981",
    actor: "Kamal Cashier",
    role: "CASHIER",
    details: JSON.stringify({ customer: "Rahim Chowdhury", amount: 1200, method: "CASH" }),
    ipAddress: "192.168.0.105",
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: "log-3",
    action: "SALE_RETURN",
    entity: "Sale",
    entityId: "INV-8921-1002",
    actor: "Admin User",
    role: "OWNER",
    details: JSON.stringify({ refundAmount: 110, reason: "Wrong size complaint", condition: "RESELLABLE" }),
    ipAddress: "192.168.0.104",
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: "log-4",
    action: "STOCK_TRANSFER",
    entity: "StockMovement",
    entityId: "TRF-2026-001",
    actor: "Rafiq Stock Keeper",
    role: "STOCK_KEEPER",
    details: JSON.stringify({ transferNo: "TRF-2026-001", from: "Gazipur Warehouse", to: "Dhaka Store", units: 150 }),
    ipAddress: "192.168.0.108",
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLogRow[]>(demoAuditLogs);
  const [filterAction, setFilterAction] = useState("ALL");

  const filtered = logs.filter(
    (l) => filterAction === "ALL" || l.action === filterAction
  );

  const handleExport = () => {
    exportToCsv({
      filename: "Immutable_Audit_Logs",
      headers: [
        { key: "createdAt", label: "Timestamp" },
        { key: "actor", label: "User" },
        { key: "role", label: "Role" },
        { key: "action", label: "Action" },
        { key: "entity", label: "Entity" },
        { key: "entityId", label: "Entity ID" },
        { key: "details", label: "Details JSON" },
        { key: "ipAddress", label: "IP Address" },
      ],
      data: filtered,
    });
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/settings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← সেটিংস মেনুতে ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🛡️ অপরিবর্তনযোগ্য অডিট হিস্ট্রি লগ (Audit Trail)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>কে, কখন, কোন সিস্টেমে কী পরিবর্তন বা ট্রানজেকশন করেছে তার বিস্তারিত সিকিউরিটি লগ।</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">📥 Export CSV</button>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 14, display: "flex", gap: 12 }}>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontSize: 14 }}
        >
          <option value="ALL">সকল অ্যাকশন (All Actions)</option>
          <option value="CREATE_SALE">CREATE_SALE (বিক্রয়)</option>
          <option value="SALE_RETURN">SALE_RETURN (বিক্রয় ফেরত)</option>
          <option value="CUSTOMER_DUE_PAYMENT">CUSTOMER_DUE_PAYMENT (বাকি আদায়)</option>
          <option value="STOCK_TRANSFER">STOCK_TRANSFER (স্টক স্থানান্তর)</option>
        </select>
        <span className="badge badge-neutral" style={{ alignSelf: "center" }}>Immutable Audit Logs (Read-only)</span>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>ইউজার ও রোল</th>
              <th>অ্যাকশন</th>
              <th>মডিউল / আইডি</th>
              <th>পরিবর্তনের বিস্তারিত (Details)</th>
              <th>আইপি এড্রেস</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDateTime(log.createdAt)}</td>
                <td>
                  <strong>{log.actor}</strong>
                  <span className="badge badge-primary" style={{ display: "block", width: "fit-content", marginTop: 2, fontSize: 10 }}>
                    {log.role}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success" style={{ fontFamily: "monospace", fontSize: 11 }}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <strong>{log.entity}</strong>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{log.entityId}</div>
                </td>
                <td>
                  <code style={{ fontSize: 11, background: "var(--bg-subtle)", padding: "4px 8px", borderRadius: 4, display: "block", maxWidth: 350, overflowX: "auto" }}>
                    {log.details}
                  </code>
                </td>
                <td style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "monospace" }}>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
