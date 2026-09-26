"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, RoleType } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState("admin@unbeatable.com");
  const [password, setPassword] = useState("password123");

  const handleRoleQuickLogin = (role: RoleType) => {
    loginAs(role);
    if (role === "CASHIER") {
      router.push("/pos");
    } else if (role === "STOCK_KEEPER") {
      router.push("/inventory");
    } else {
      router.push("/dashboard");
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs("OWNER");
    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#ffffff", borderRadius: 20, padding: 36, boxShadow: "var(--shadow-pos)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: "var(--aurora-gradient)", color: "#fff", fontWeight: 800, fontSize: 26, borderRadius: 14, display: "grid", placeItems: "center", margin: "0 auto 12px", boxShadow: "var(--aurora-glow)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
            U
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Unbeatable ERP</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>আপনার স্টোর একাউন্টে লগইন করুন</p>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleStandardSubmit} style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4 }}>ইমেইল বা ফোন নম্বর</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>পাসওয়ার্ড</label>
              <a href="#" style={{ fontSize: 12, color: "var(--primary)" }}>পাসওয়ার্ড ভুলে গেছেন?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", fontSize: 14 }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px 0", justifyContent: "center", fontSize: 15, fontWeight: 700, borderRadius: 8 }}>
            লগইন করুন (Sign In)
          </button>
        </form>

        {/* Role-based quick demo switch */}
        <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 20 }}>
          <span style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: 0.5, marginBottom: 10, textAlign: "center" }}>
            ⚡ ১-ক্লিকে রোল সুইচ করুন (Demo Roles):
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              onClick={() => handleRoleQuickLogin("OWNER")}
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
            >
              👑 <b>Owner / Admin</b>
              <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>সকল মডিউল ও রিপোর্ট</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleQuickLogin("CASHIER")}
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
            >
              ⚡ <b>Cashier</b>
              <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>POS ও সেলস কাউন্টার</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleQuickLogin("STOCK_KEEPER")}
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
            >
              📦 <b>Stock Keeper</b>
              <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>ইনভেন্টরি ও ট্রান্সফার</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleQuickLogin("ACCOUNTANT")}
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
            >
              💵 <b>Accountant</b>
              <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>ক্যাশবুক ও লাভ-ক্ষতি</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
