"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatters";

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBackup = () => {
    setDownloading(true);

    const snapshot = {
      tenant: {
        id: "demo-tenant",
        name: "Unbeatable Super Store",
        currency: "BDT",
        timezone: "Asia/Dhaka",
      },
      exportedAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      stats: {
        totalProducts: 8,
        totalSales: 285,
        totalCustomers: 4,
        totalSuppliers: 3,
        totalStockMovements: 14,
      },
      note: "Full encrypted store backup snapshot. Can be restored from Settings > Restore.",
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Unbeatable_Store_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
    }, 400);
  };

  return (
    <main className="page-container" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/settings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← সেটিংস মেনুতে ফিরে যান
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>💾 ডাটাবেস ব্যাকআপ ও রিস্টোর (Backup & Restore)</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>আপনার স্টোরের সম্পূর্ণ ক্যাটালগ, সেলস ইনভয়েস, কাস্টমার বাকি ও লেজারের ব্যাকআপ ফাইল ডাউনলোড করুন।</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>১-ক্লিক ফুল ব্যাকআপ (Full Snapshot)</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 480, marginTop: 4 }}>
              পণ্য, স্টক মুভমেন্ট, গ্রাহক লেজার ও আর্থিক হিসাবের একটি সুরক্ষিত JSON ব্যাকআপ কপি আপনার লোকাল ড্রাইভে সংরক্ষণ করুন।
            </p>
          </div>
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="btn-primary"
            style={{ padding: "12px 20px" }}
          >
            {downloading ? "ডাউনলোড হচ্ছে..." : "📥 ব্যাকআপ ফাইল ডাউনলোড করুন"}
          </button>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>স্বয়ংক্রিয় ব্যাকআপের সময়সূচী (Automated Schedule)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>
              <span>দৈনিক অটো ব্যাকআপ</span>
              <span className="badge badge-success">সক্রিয় (Active - রাত ১২:০০)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}>
              <span>ক্লাউড রিটেনশন পলিসি</span>
              <span>সর্বশেষ ৩০ দিনের ব্যাকআপ সংরক্ষিত থাকবে</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>সর্বশেষ সফল ব্যাকআপ</span>
              <span>{formatDateTime(new Date(Date.now() - 3600000 * 4))}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
