import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import {
  IconPos,
  IconPlus,
  IconTrendUp,
  IconSales,
  IconProducts,
  IconPurchases,
  IconExpenses,
  IconCustomers,
  IconInventory,
  IconLogistics,
  IconSms,
  IconReports,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = [
    {
      title: "আজকের মোট বিক্রয়",
      value: formatCurrency(48650),
      subtitle: "৩২টি সম্পন্ন অর্ডার",
      badge: "+18.4%",
      isPositive: true,
      accentColor: "#4f46e5",
      icon: <IconSales size={22} color="#4f46e5" />,
      bgIcon: "#eef2ff",
    },
    {
      title: "আজকের নিট প্রফিট",
      value: formatCurrency(11820),
      subtitle: "২৪.৩% গ্রস মার্জিন",
      badge: "+12.1%",
      isPositive: true,
      accentColor: "#10b981",
      icon: <IconReports size={22} color="#10b981" />,
      bgIcon: "#ecfdf5",
    },
    {
      title: "কম স্টক সতর্কবার্তা",
      value: "৩টি আইটেম",
      subtitle: "রি-অর্ডার পয়েন্টের নিচে",
      badge: "Action",
      isPositive: false,
      accentColor: "#f59e0b",
      icon: <IconInventory size={22} color="#f59e0b" />,
      bgIcon: "#fffbeb",
    },
    {
      title: "মোট কাস্টমার বাকি (Due)",
      value: formatCurrency(18250),
      subtitle: "৪২ জন গ্রাহকের কাছে পাওনা",
      badge: "বকেয়া",
      isPositive: false,
      accentColor: "#f43f5e",
      icon: <IconCustomers size={22} color="#f43f5e" />,
      bgIcon: "#fff1f2",
    },
  ];

  // Demo Recent Sales
  const recentSales = [
    { invoice: "INV-8921-1005", customer: "Rahim Chowdhury", amount: 2700, method: "bKash + Cash", time: "১০ মিনিট আগে", status: "PAID" },
    { invoice: "INV-8921-1004", customer: "Kalam Store", amount: 15400, method: "Due (বাকি)", time: "২৫ মিনিট আগে", status: "DUE" },
    { invoice: "INV-8921-1003", customer: "Walk-in Customer", amount: 850, method: "Cash", time: "১ ঘণ্টা আগে", status: "PAID" },
    { invoice: "INV-8921-1002", customer: "Jamil Hossain", amount: 3200, method: "Card (POS)", time: "২ ঘণ্টা আগে", status: "PAID" },
  ];

  // Demo Low Stock Alerts
  const lowStockItems = [
    { name: "Miniket Rice 25kg", sku: "RICE-MIN-25", currentStock: 2, reorderLevel: 10, unit: "Bags" },
    { name: "Rupchanda Soyabean Oil 5L", sku: "OIL-RUP-5L", currentStock: 3, reorderLevel: 15, unit: "Cans" },
    { name: "Aarong Fresh Milk 1L", sku: "MILK-AAR-1L", currentStock: 4, reorderLevel: 20, unit: "Pcs" },
  ];

  return (
    <main className="page-container">
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge badge-primary">লাইভ মনিটরিং</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Main Branch Outlet</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-main)", marginTop: 4, letterSpacing: "-0.5px" }}>
            ব্যবসা ওভারভিউ ও ড্যাশবোর্ড
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5 }}>
            আজকের রিয়েল-টাইম বিক্রয়, আনুমানিক লাভ, স্টক এলার্ট এবং দৈনন্দিন অপারেশনাল মেট্রিক্স।
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/products/new" className="btn-secondary">
            <IconPlus size={16} />
            <span>নতুন প্রোডাক্ট</span>
          </Link>
          <Link href="/pos" className="btn-primary" style={{ padding: "11px 22px", fontSize: 14 }}>
            <IconPos size={18} />
            <span>⚡ POS কাউন্টার চালু করুন</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card" style={{ borderTop: `3px solid ${stat.accentColor}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="stat-card-title">{stat.title}</span>
                <div className="stat-card-value" style={{ marginTop: 4 }}>{stat.value}</div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: stat.bgIcon,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                {stat.icon}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
              <span className="stat-card-sub">{stat.subtitle}</span>
              <span
                className="badge"
                style={{
                  background: stat.isPositive ? "var(--success-bg)" : "var(--danger-bg)",
                  color: stat.isPositive ? "var(--success-text)" : "var(--danger-text)",
                  border: `1px solid ${stat.isPositive ? "var(--success-border)" : "var(--danger-border)"}`,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {stat.isPositive && <IconTrendUp size={12} color="currentColor" />}
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Performance & Quick Actions Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 24, marginBottom: 28 }}>
        {/* Sales Performance Graph Mockup */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)" }}>📊 বিক্রয় ও লাভ ট্রেন্ড (চলতি সপ্তাহ)</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>দৈনিক বিক্রয় গ্রোথ এবং প্রফিট অ্যানালিটিক্স</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="badge badge-primary">Revenue: ৳৩,৪২,৫০০</span>
            </div>
          </div>

          {/* Realistic CSS Bar Chart */}
          <div style={{ height: 180, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, padding: "0 10px 10px 10px", borderBottom: "1px solid var(--border-color)" }}>
            {[
              { day: "শনি", val: 65, profit: 45, rev: "৳৩৮,০০০" },
              { day: "রবি", val: 80, profit: 55, rev: "৳৪৮,০০০" },
              { day: "সোম", val: 50, profit: 35, rev: "৳২৯,০০০" },
              { day: "মঙ্গল", val: 75, profit: 50, rev: "৳৪৫,০০০" },
              { day: "বুধ", val: 90, profit: 65, rev: "৳৫৬,০০০" },
              { day: "বৃহঃ", val: 85, profit: 60, rev: "৳৫২,০০০" },
              { day: "শুক্র (আজ)", val: 98, profit: 75, rev: "৳৭৬,৫০০" },
            ].map((bar, idx) => (
              <div key={bar.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 130 }}>
                  <div
                    title={`Sales: ${bar.rev}`}
                    style={{
                      width: "45%",
                      height: `${bar.val}%`,
                      background: idx === 6 ? "linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)" : "linear-gradient(180deg, #818cf8 0%, #6366f1 100%)",
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.3s ease",
                      boxShadow: idx === 6 ? "0 4px 12px rgba(79, 70, 229, 0.4)" : "none",
                    }}
                  />
                  <div
                    title={`Profit Margin`}
                    style={{
                      width: "45%",
                      height: `${bar.profit}%`,
                      background: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.3s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, fontWeight: idx === 6 ? 800 : 600, color: idx === 6 ? "var(--primary-dark)" : "var(--text-muted)" }}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#4f46e5", display: "inline-block" }} />
                মোট বিক্রয় (Revenue)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981", display: "inline-block" }} />
                নিট লাভ (Gross Profit)
              </span>
            </div>
            <span>সর্বোচ্চ সেল: <strong>শুক্রবার (৳৭৬,৫০০)</strong></span>
          </div>
        </div>

        {/* Quick Operations Matrix */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>⚡ দ্রুত একশন হাব (Quick Hub)</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>প্রয়োজনীয় মডিউলে সরাসরি জাম্প করুন</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Link
              href="/pos"
              style={{
                padding: "12px",
                background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                borderRadius: "var(--radius-md)",
                border: "1px solid #c7d2fe",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "transform var(--transition-fast)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <IconPos size={20} color="var(--primary)" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-dark)" }}>Open ›</span>
              </div>
              <strong style={{ fontSize: 13.5, color: "var(--primary-dark)" }}>পিওএস কাউন্টার</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>আল্ট্রাফাস্ট বিলিং</span>
            </Link>

            <Link
              href="/purchases/new"
              style={{
                padding: "12px",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "transform var(--transition-fast)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <IconPurchases size={20} color="#059669" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>＋ Add</span>
              </div>
              <strong style={{ fontSize: 13.5 }}>নতুন পারচেজ</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>মাল্টি-আইটেম চালান</span>
            </Link>

            <Link
              href="/marketing/sms"
              style={{
                padding: "12px",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "transform var(--transition-fast)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <IconSms size={20} color="#0284c7" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Send</span>
              </div>
              <strong style={{ fontSize: 13.5 }}>এসএমএস মার্কেটিং</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>বাকি তাগাদা ও অফার</span>
            </Link>

            <Link
              href="/logistics"
              style={{
                padding: "12px",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "transform var(--transition-fast)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <IconLogistics size={20} color="#d97706" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Track</span>
              </div>
              <strong style={{ fontSize: 13.5 }}>কুরিয়ার ও ডেলিভারি</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Steadfast & Pathao</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Invoices & Low Stock Alert */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Recent Invoices Table */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>🧾 সর্বশেষ বিক্রয় রসিদ (Recent Sales)</h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>আজকের লাইভ লেনদেনের রেকর্ড</span>
            </div>
            <Link href="/sales" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
              সব দেখুন →
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>ইনভয়েস #</th>
                  <th>কাস্টমার</th>
                  <th>পরিমাণ</th>
                  <th>পেমেন্ট মেথড</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.invoice}>
                    <td>
                      <strong style={{ color: "var(--primary-dark)", fontSize: 13 }}>{sale.invoice}</strong>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sale.time}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{sale.customer}</td>
                    <td><strong style={{ fontSize: 14 }}>{formatCurrency(sale.amount)}</strong></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{sale.method}</td>
                    <td>
                      <span className={`badge ${sale.status === "PAID" ? "badge-success" : "badge-danger"}`}>
                        {sale.status === "PAID" ? "পরিশোধিত" : "বকেয়া বাকি"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--warning-text)" }}>⚠️ লো-স্টক সতর্কতা তালিকা</h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>যেসব আইটেম দ্রুত শেষ হচ্ছে</span>
            </div>
            <Link href="/inventory" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
              ইনভেন্টরি →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lowStockItems.map((item) => (
              <div
                key={item.sku}
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ display: "block", fontSize: 13.5, color: "var(--text-main)" }}>{item.name}</strong>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{item.sku}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--danger)" }}>
                    {item.currentStock} {item.unit}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Reorder: {item.reorderLevel} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, textAlign: "center" }}>
            <Link href="/purchases/new" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
              ＋ স্টক ইনওয়ার্ড চালান তৈরি করুন
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
