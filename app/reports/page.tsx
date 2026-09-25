import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>রিপোর্টস ও ব্যবসায়িক অ্যানালিটিক্স</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>নিখুঁত লাভ-ক্ষতি, বিক্রয় অ্যানালাইসিস ও ইনভেন্টরি ভ্যালুয়েশন রিপোর্ট।</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/reports/profit-loss" className="btn-secondary">
            📊 Profit & Loss
          </Link>
          <Link href="/reports/balance-sheet" className="btn-secondary">
            🏛️ Balance Sheet
          </Link>
          <Link href="/reports/vat" className="btn-primary">
            🏛️ NBR VAT মূসক-৯.১
          </Link>
          <Link href="/accounting/bank-accounts" className="btn-secondary">
            🏦 Bank Accounts
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-title">চলতি মাসের মোট বিক্রয়</span>
          <div className="stat-card-value">{formatCurrency(458900)}</div>
          <div className="stat-card-sub">বিগত মাসের তুলনায় +১২.৫% বৃদ্ধি</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">চলতি মাসের গ্রস লাভ (Gross Profit)</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>{formatCurrency(86450)}</div>
          <div className="stat-card-sub">গড় প্রফিট মার্জিন ১৮.৮%</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">চলতি মাসের মোট খরচ (Expenses)</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>{formatCurrency(29850)}</div>
          <div className="stat-card-sub">দোকান ভাড়া, বিদ্যুৎ বিল ও স্টাফ খরচ</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">নিট মুনাফা (Net Profit)</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>{formatCurrency(56600)}</div>
          <div className="stat-card-sub">সর্বশেষ ৩১ দিনের হিসাব</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>শীর্ষ বিক্রিত পণ্য (Top Selling Products)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <strong>Miniket Rice 25kg</strong>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>১২০ বস্তা বিক্রয়</span>
              </div>
              <strong>{formatCurrency(222000)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <strong>Soyabean Oil 5 Litre</strong>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>৮৫ বোতল বিক্রয়</span>
              </div>
              <strong>{formatCurrency(69700)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Dano Milk Powder 1kg</strong>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>৪৫ প্যাকেট বিক্রয়</span>
              </div>
              <strong>{formatCurrency(37800)}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>ক্যাশিয়ার পারফরম্যান্স ও সেলস শিফট</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <strong>Admin User (Counter 01)</strong>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>১৬৫টি ইনভয়েস সম্পন্ন</span>
              </div>
              <strong style={{ color: "var(--primary)" }}>{formatCurrency(285400)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Cashier 01 (Counter 02)</strong>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>১০৫টি ইনভয়েস সম্পন্ন</span>
              </div>
              <strong style={{ color: "var(--primary)" }}>{formatCurrency(173500)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
