"use client";

import Link from "next/link";

export default function SettingsPage() {
  const quickSettings = [
    { title: "মাল্টি-ব্রাঞ্চ ও আউটলেট", subtitle: "শাখা, কাউন্টার ও স্টাফ ম্যানেজমেন্ট", href: "/settings/branches", icon: "🏢" },
    { title: "SaaS সাবস্ক্রিপশন ও প্ল্যান", subtitle: "রিসোর্স ব্যবহার, সীমা ও বিলিং", href: "/settings/subscription", icon: "💳" },
    { title: "সিকিউরিটি অডিট হিস্ট্রি", subtitle: "অপরিবর্তনযোগ্য সিস্টেম ট্রানজেকশন লগ", href: "/settings/audit-logs", icon: "🛡️" },
    { title: "ডাটাবেস ব্যাকআপ ও রিস্টোর", subtitle: "১-ক্লিক সম্পূর্ণ ডাটা ব্যাকআপ ডাউনলোড", href: "/settings/backup", icon: "💾" },
  ];

  return (
    <main className="page-container" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>⚙️ সিস্টেম ও ব্যবসা সেটিংস (Settings)</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>প্রতিষ্ঠান কনফিগারেশন, শাখা, সাবস্ক্রিপশন, সিকিউরিটি ও ব্যাকআপ।</p>
      </div>

      {/* Quick Settings Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {quickSettings.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: 6, transition: "transform 0.15s ease, box-shadow 0.15s ease", cursor: "pointer" }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
            <strong style={{ fontSize: 15, color: "var(--text-main)" }}>{item.title}</strong>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.subtitle}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>১. প্রতিষ্ঠান ও ব্রাঞ্চ তথ্য (Business Profile)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>দোকানের নাম</label>
              <input defaultValue="Unbeatable Super Store" style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ডিফল্ট কারেন্সি</label>
              <input defaultValue="BDT (৳)" disabled style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 6, background: "#f8fafc" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>প্রধান ব্রাঞ্চ (Main Branch)</label>
              <input defaultValue="Dhaka Main Store" style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 6 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>টাইমজোন</label>
              <input defaultValue="Asia/Dhaka (UTC+6)" disabled style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 6, background: "#f8fafc" }} />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>২. পিওএস ও রসিদ সেটিংস (POS & Print Setup)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>পেমেন্ট সম্পন্ন হওয়ার পর স্বয়ংক্রিয় থার্মাল রসিদ পপআপ খুলবে</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>ক্যাশ ড্রয়ার শিফট ওপেন ছাড়া ক্যাশিয়ার সেল গ্রহণ করতে পারবে না</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>নেগেটিভ স্টক (মজুদ শূন্য হলেও বিক্রি) ডিফল্টভাবে নিষিদ্ধ থাকবে</span>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-primary">✓ সেটিংস সংরক্ষণ করুন</button>
        </div>
      </div>
    </main>
  );
}
