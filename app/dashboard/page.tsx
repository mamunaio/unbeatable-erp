import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = [
    { title: "আজকের মোট বিক্রয়", value: formatCurrency(0), subtitle: "০টি সম্পন্ন অর্ডার", badge: "+০%", tone: "badge-primary" },
    { title: "আজকের আনুমানিক লাভ", value: formatCurrency(0), subtitle: "গ্রস প্রফিট মার্জিন", badge: "Margin", tone: "badge-success" },
    { title: "কম স্টক সতর্কবার্তা", value: "০টি আইটেম", subtitle: "Reorder point-এর নিচে", badge: "Action needed", tone: "badge-warning" },
    { title: "মোট কাস্টমার বাকি (Due)", value: formatCurrency(0), subtitle: "বকেয়া ব্যালেন্স", badge: "Receivable", tone: "badge-danger" },
  ];

  return (
    <main className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-main)" }}>ব্যবসা ওভারভিউ ও ড্যাশবোর্ড</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>আজকের বিক্রয়, লাভ, স্টক এবং দৈনন্দিন অপারেশনাল রিপোর্ট।</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/pos" className="btn-primary">
            ⚡ New POS Sale
          </Link>
          <Link href="/products/new" className="btn-secondary">
            ＋ Add Product
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="stat-card-title">{stat.title}</span>
              <span className={`badge ${stat.tone}`}>{stat.badge}</span>
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-sub">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Sales Performance Panel */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>বিক্রয় ও লাভ গ্রাফ (গত ৭ দিন)</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>দৈনিক বিক্রয় পারফরম্যান্স ট্রেন্ড</p>
            </div>
            <span className="badge badge-neutral">Main Branch</span>
          </div>
          
          <div style={{ height: 220, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-color)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 32 }}>📈</span>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>আজকের লাইভ বিক্রয় শুরু হলে গ্রাফে রিয়েল-টাইম ট্রেন্ড প্রদর্শিত হবে।</p>
            <Link href="/pos" className="btn-primary" style={{ padding: "6px 14px", fontSize: 13, marginTop: 4 }}>
              প্রথম সেল শুরু করুন
            </Link>
          </div>
        </div>

        {/* Quick Operations */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>দ্রুত একশন (Quick Actions)</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>প্রয়োজনীয় মেনুগুলো এক ক্লিকে এক্সেস করুন</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/pos" style={{ padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div>
                  <strong style={{ fontSize: 14, display: "block" }}>পিওএস কাউন্টার (POS)</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>দ্রুত বিলিং ও ক্যাশ গ্রহণ</span>
                </div>
              </div>
              <span>›</span>
            </Link>

            <Link href="/products/new" style={{ padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📦</span>
                <div>
                  <strong style={{ fontSize: 14, display: "block" }}>নতুন প্রোডাক্ট যুক্ত করুন</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ক্যাটালগে আইটেম ও মূল্য দিন</span>
                </div>
              </div>
              <span>›</span>
            </Link>

            <Link href="/purchases" style={{ padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🛒</span>
                <div>
                  <strong style={{ fontSize: 14, display: "block" }}>স্টক ইনওয়ার্ড (Purchase)</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>সাপ্লায়ার চালান ও মজুদ বৃদ্ধি</span>
                </div>
              </div>
              <span>›</span>
            </Link>

            <Link href="/expenses" style={{ padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>💵</span>
                <div>
                  <strong style={{ fontSize: 14, display: "block" }}>দৈনিক খরচ (Expense)</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>দোকানের খরচ ক্যাশবুক এন্ট্রি</span>
                </div>
              </div>
              <span>›</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>সাম্প্রতিক বিক্রয় রসিদ (Recent Sales)</h2>
            <Link href="/sales" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>সব দেখুন →</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>🧾</span>
            <p style={{ fontSize: 14, fontWeight: 600 }}>আজকের কোনো বিক্রয় এখনো সম্পন্ন হয়নি।</p>
            <span style={{ fontSize: 12 }}>POS কাউন্টার থেকে সেল করলে এখানে সাথে সাথে আপডেট হবে।</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>লো-স্টক এলার্ট (Low Stock Alert)</h2>
            <Link href="/inventory" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>ইনভেন্টরি দেখুন →</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 8, color: "var(--success)" }}>✓</span>
            <p style={{ fontSize: 14, fontWeight: 600 }}>বর্তমানে সব প্রোডাক্ট পর্যাপ্ত পরিমাণে রয়েছে।</p>
            <span style={{ fontSize: 12 }}>কোনো আইটেম রি-অর্ডার পয়েন্টের নিচে গেলে এখানে সতর্কবার্তা আসবে।</span>
          </div>
        </div>
      </div>
    </main>
  );
}
