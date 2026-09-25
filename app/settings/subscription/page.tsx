"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("PRO");

  const usage = {
    products: { current: 8, max: 1000 },
    branches: { current: 3, max: 5 },
    users: { current: 4, max: 10 },
    invoices: { current: 285, max: "Unlimited" },
  };

  const plans = [
    {
      id: "STARTER",
      name: "Starter Store",
      price: "৳ ৯৯০ / মাস",
      subtitle: "ছোট দোকান বা একক কাউন্টারের জন্য",
      features: ["সর্বোচ্চ ৩০০ প্রোডাক্ট", "১টি ব্রাঞ্চ ও ১টি পিওএস কাউন্টার", "২ জন স্টাফ একাউন্ট", "বেসিক বিক্রয় রিপোর্ট ও প্রিন্ট"],
      popular: false,
    },
    {
      id: "PRO",
      name: "Business Pro",
      price: "৳ ২,৪৯০ / মাস",
      subtitle: "সুপারশপ ও দ্রুত বর্ধনশীল রিটেইল স্টোরের জন্য",
      features: ["সর্বোচ্চ ১,০০০ প্রোডাক্ট", "৫টি পর্যন্ত ব্রাঞ্চ ও কাউন্টার", "১০ জন স্টাফ ও রোল ম্যানেজমেন্ট", "ডাবল-এন্ট্রি ইনভেন্টরি লেজার", "লাভ-ক্ষতি ও অডিট ট্রেইল", "বারকোড স্টিকার প্রিন্ট স্টুডিও"],
      popular: true,
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise Multi-Chain",
      price: "৳ ৫,৯৯০ / মাস",
      subtitle: "বড় রিটেইল চেইন ও পাইকারি প্রতিষ্ঠানের জন্য",
      features: ["আনলিমিটেড প্রোডাক্ট ও ইনভয়েস", "আনলিমিটেড ব্রাঞ্চ ও ওয়্যারহাউজ", "আনলিমিটেড ইউজার ও ক্যাশিয়ার", "কাস্টম API ও ই-কমার্স ইন্টিগ্রেশন", "ডেডিকেটেড ২৪/৭ সাপোর্ট"],
      popular: false,
    },
  ];

  return (
    <main className="page-container">
      <div style={{ marginBottom: 24 }}>
        <Link href="/settings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← সেটিংস মেনুতে ফিরে যান
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>💳 SaaS সাবস্ক্রিপশন ও প্ল্যান লিমিট</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>আপনার স্টোরের সক্রিয় সাবস্ক্রিপশন স্ট্যাটাস, রিসোর্স ব্যবহার ও প্ল্যান আপগ্রেড।</p>
      </div>

      {/* Active Subscription Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff", padding: 24, marginBottom: 28, border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="badge badge-primary" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: 8 }}>
              ● ACTIVE SUBSCRIPTION
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Business Pro Plan</h2>
            <p style={{ fontSize: 13, color: "#cbd5e1" }}>পরবর্তী বিলিং তারিখ: ২৫ অক্টোবর ২০২৬ (মাসিক বিলিং)</p>
          </div>
          <button className="btn-primary" style={{ background: "#ffffff", color: "var(--primary-dark)", fontWeight: 700 }}>
            ⚡ প্ল্যান আপগ্রেড করুন
          </button>
        </div>
      </div>

      {/* Resource Usage Meters */}
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>রিসোর্স ব্যবহার ও সীমা (Resource Usage):</h2>
      <div className="stat-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span className="stat-card-title">প্রোডাক্ট ক্যাটালগ</span>
            <strong>{usage.products.current} / {usage.products.max}</strong>
          </div>
          <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", margin: "8px 0" }}>
            <div style={{ width: `${(usage.products.current / usage.products.max) * 100}%`, height: "100%", background: "var(--primary)" }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>০.৮% ব্যবহৃত</span>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span className="stat-card-title">ব্রাঞ্চ ও আউটলেট</span>
            <strong>{usage.branches.current} / {usage.branches.max}</strong>
          </div>
          <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", margin: "8px 0" }}>
            <div style={{ width: `${(usage.branches.current / usage.branches.max) * 100}%`, height: "100%", background: "var(--success)" }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>৬০% ব্যবহৃত (২টি বাকি)</span>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span className="stat-card-title">স্টাফ ও ক্যাশিয়ার ইউজার</span>
            <strong>{usage.users.current} / {usage.users.max}</strong>
          </div>
          <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", margin: "8px 0" }}>
            <div style={{ width: `${(usage.users.current / usage.users.max) * 100}%`, height: "100%", background: "var(--warning)" }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>৪০% ব্যবহৃত (৬টি বাকি)</span>
        </div>
      </div>

      {/* Pricing Comparison Cards */}
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>উপলব্ধ প্ল্যানসমূহ (Subscription Plans):</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card"
            style={{
              position: "relative",
              border: plan.id === selectedPlan ? "2px solid var(--primary)" : "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {plan.popular && (
              <span className="badge badge-primary" style={{ position: "absolute", top: -12, right: 16 }}>
                ★ Current Active Plan
              </span>
            )}

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{plan.name}</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>{plan.subtitle}</p>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary-dark)", marginBottom: 16 }}>{plan.price}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--border-color)", paddingTop: 14 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={plan.id === selectedPlan ? "btn-secondary" : "btn-primary"}
              style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
            >
              {plan.id === selectedPlan ? "বর্তমান প্ল্যান" : "এই প্ল্যানে আপগ্রেড করুন"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
