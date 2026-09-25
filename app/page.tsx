import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-container" style={{ paddingTop: 48 }}>
      <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
        <span className="badge badge-primary" style={{ padding: "6px 14px", fontSize: 13, marginBottom: 16 }}>
          ⚡ Next-Gen Retail ERP for Bangladesh
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.15, marginTop: 12, marginBottom: 16 }}>
          সহজ, শক্তিশালী ও পরিপূর্ণ রিটেইল শপ ম্যানেজমেন্ট
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 32 }}>
          সুপারশপ, কসমেটিকস, হার্ডওয়্যার বা যেকোনো রিটেইল ব্যবসার জন্য দ্রুততম POS, ইনভেন্টরি লেজার ও নিখুঁত লাভ-ক্ষতির হিসাব।
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <Link href="/pos" className="btn-primary" style={{ padding: "14px 28px", fontSize: 16 }}>
            ⚡ Open POS Counter
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: "14px 28px", fontSize: 16 }}>
            📊 Go to Dashboard
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, textAlign: "left" }}>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 10 }}>⚡</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Ultra-Fast POS</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>ক্যাশ, কার্ড, বিকাশ/নগদ পেমেন্ট, বারকোড স্ক্যানার ও কিবোর্ড শর্টকাট।</p>
          </div>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 10 }}>📦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Stock Movement Ledger</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>সরাসরি স্টক ওভাররাইট নয়; ডাবল-এন্ট্রি ইনভেন্টরি ট্র্যাকিং ও লো-স্টক অ্যালার্ট।</p>
          </div>
          <div className="card">
            <div style={{ fontSize: 24, marginBottom: 10 }}>💵</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Due & Shift Control</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>কাস্টমার/সাপ্লায়ার বাকি খাতা ও ক্যাশিয়ারের ক্যাশ ড্রয়ার শিফট ভেরিয়েন্স।</p>
          </div>
        </div>
      </div>
    </main>
  );
}
