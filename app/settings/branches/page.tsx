"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatters";

interface BranchRow {
  id: string;
  name: string;
  code: string;
  phone: string;
  address: string;
  isMain: boolean;
  countersCount: number;
  staffCount: number;
  status: "ACTIVE" | "INACTIVE";
}

const initialBranches: BranchRow[] = [
  { id: "b1", name: "Dhaka Main Store", code: "DHAKA-MAIN", phone: "+880 1711-111111", address: "Dhanmondi, Dhaka", isMain: true, countersCount: 2, staffCount: 4, status: "ACTIVE" },
  { id: "b2", name: "Uttara Outlet Branch", code: "DHAKA-UTTARA", phone: "+880 1722-222222", address: "Sector 3, Uttara, Dhaka", isMain: false, countersCount: 1, staffCount: 2, status: "ACTIVE" },
  { id: "b3", name: "Chittagong GEC Branch", code: "CTG-GEC", phone: "+880 1733-333333", address: "GEC Circle, Chittagong", isMain: false, countersCount: 1, staffCount: 2, status: "ACTIVE" },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchRow[]>(initialBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isMain, setIsMain] = useState(false);

  const handleCreateBranch = () => {
    if (!name.trim() || !code.trim()) return;
    const newBr: BranchRow = {
      id: `b-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      phone: phone || "—",
      address: address || "—",
      isMain,
      countersCount: 1,
      staffCount: 1,
      status: "ACTIVE",
    };
    setBranches([...branches, newBr]);
    setIsModalOpen(false);
    setName("");
    setCode("");
    setPhone("");
    setAddress("");
  };

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Link href="/settings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
            ← সেটিংস মেনুতে ফিরে যান
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>🏢 মাল্টি-ব্রাঞ্চ ও আউটলেট ম্যানেজমেন্ট</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>দোকানের সকল শাখা, কাউন্টার ও স্টাফ নির্ধারণ করুন।</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          ＋ নতুন ব্রাঞ্চ যুক্ত করুন
        </button>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>শাখার নাম (Branch Name)</th>
              <th>ব্রাঞ্চ কোড</th>
              <th>মোবাইল নম্বর</th>
              <th>ঠিকানা</th>
              <th>কাউন্টার / স্টাফ</th>
              <th>স্ট্যাটাস</th>
              <th style={{ textAlign: "right" }}>একশন</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id}>
                <td>
                  <strong>{b.name}</strong>
                  {b.isMain && <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: 10 }}>Head Office</span>}
                </td>
                <td><span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--primary-dark)" }}>{b.code}</span></td>
                <td>{b.phone}</td>
                <td>{b.address}</td>
                <td><strong>{b.countersCount}টি কাউন্টার</strong> • {b.staffCount} স্টাফ</td>
                <td><span className="badge badge-success">{b.status}</span></td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: 12 }}>Manage Counters</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 14, width: "100%", maxWidth: 460, boxShadow: "var(--shadow-pos)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>নতুন স্টোর ব্রাঞ্চ যোগ করুন</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ব্রাঞ্চের নাম *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: মিরপুর ১০ শাখা" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ব্রাঞ্চ কোড (Unique Code) *</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="যেমন: DHAKA-MIRPUR" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>যোগাযোগের মোবাইল</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017XXXXXXXX" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ঠিকানা ও লোকেশন</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="মিরপুর ১০ গোলচত্বর, ঢাকা" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }} />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginTop: 4 }}>
                <input type="checkbox" checked={isMain} onChange={(e) => setIsMain(e.target.checked)} />
                <span>প্রধান শাখা (Main Head Branch) হিসেবে চিহ্নিত করুন</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">বাতিল</button>
              <button onClick={handleCreateBranch} className="btn-primary">✓ ব্রাঞ্চ সংরক্ষণ করুন</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
