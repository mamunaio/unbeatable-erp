"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

export default function VatReportPage() {
  const [taxPeriod, setTaxPeriod] = useState("2026-09");

  // Financial & VAT Figures (BDT)
  // Part 3: Supplies / Sales (Output VAT)
  const standardSales15 = 350000; // 15% Standard Rated Sales
  const outputVat15 = standardSales15 * 0.15; // 52,500

  const reducedSales75 = 80000; // 7.5% Retail / Super Shop Truncated Rate
  const outputVat75 = reducedSales75 * 0.075; // 6,000

  const exemptSales = 35000; // Zero-rated / Exempt Food essentials (Rice, Oil, Milk)
  const outputVatExempt = 0;

  const totalGrossSales = standardSales15 + reducedSales75 + exemptSales; // 465,000
  const totalOutputVat = outputVat15 + outputVat75 + outputVatExempt; // 58,500

  // Part 4: Purchases / Input Tax Rebate
  const localTaxablePurchases15 = 260000;
  const inputVatRebate15 = localTaxablePurchases15 * 0.15; // 39,000

  const nonRebatePurchases = 50000; // Exempt / Unregistered purchases
  const totalPurchases = localTaxablePurchases15 + nonRebatePurchases; // 310,000
  const totalInputVatRebate = inputVatRebate15; // 39,000

  // Part 5: Net Tax Payable
  const grossPayableVat = Math.max(0, totalOutputVat - totalInputVatRebate); // 19,500

  // Part 6: Withholding Tax (VDS) & Adjustments
  const vdsDeductedByClients = 2500; // উৎসে কর্তিত ভ্যাট
  const previousPeriodBalance = 0; // পূর্ববর্তী মেয়াদের জের

  // Part 7: Net Treasury Payable
  const netTreasuryPayable = Math.max(0, grossPayableVat - vdsDeductedByClients - previousPeriodBalance); // 17,000

  // Treasury Deposit Details
  const treasuryChallanNo = "TR-NBR-2026-092812";
  const challanBank = "Sonali Bank PLC (Customs & VAT Branch)";
  const challanDate = "2026-09-25";

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(1150);
  const [calcVatRate, setCalcVatRate] = useState(15);
  const [isInclusive, setIsInclusive] = useState(true);

  const calcBasePrice = isInclusive
    ? calcAmount / (1 + calcVatRate / 100)
    : calcAmount;
  const calcVatPortion = isInclusive
    ? calcAmount - calcBasePrice
    : (calcAmount * calcVatRate) / 100;
  const calcTotalPrice = isInclusive ? calcAmount : calcAmount + calcVatPortion;

  const handleExport = () => {
    exportToCsv({
      filename: `NBR_MUSHAK_9_1_VAT_Return_${taxPeriod}`,
      headers: [
        { key: "section", label: "MUSHAK-9.1 Part & Description" },
        { key: "taxableValue", label: "Taxable Base Value (BDT)" },
        { key: "vatRate", label: "VAT Rate" },
        { key: "vatAmount", label: "VAT Amount (BDT)" },
      ],
      data: [
        { section: "অংশ ৩ (ক): ১৫% আদর্শ হারে পণ্য সরবরাহ", taxableValue: standardSales15, vatRate: "15%", vatAmount: outputVat15 },
        { section: "অংশ ৩ (খ): ৭.৫% হ্রাসকৃত হারে সরবরাহ (সুপারশপ)", taxableValue: reducedSales75, vatRate: "7.5%", vatAmount: outputVat75 },
        { section: "অংশ ৩ (গ): ভ্যাট অব্যাহতিপ্রাপ্ত অত্যাবশ্যকীয় পণ্য", taxableValue: exemptSales, vatRate: "0%", vatAmount: 0 },
        { section: "মোট বিক্রয় ও আউটপুট ভ্যাট (Total Output VAT)", taxableValue: totalGrossSales, vatRate: "--", vatAmount: totalOutputVat },
        { section: "অংশ ৪: ১৫% হারে স্থানীয় ক্রয়ের উপর রেয়াত (Input Tax)", taxableValue: localTaxablePurchases15, vatRate: "15%", vatAmount: -inputVatRebate15 },
        { section: "অংশ ৫: প্রদেয় নিট কর (Net Output - Input)", taxableValue: "--", vatRate: "--", vatAmount: grossPayableVat },
        { section: "অংশ ৬: উৎসে কর্তিত ভ্যাট সমন্বয় (VDS)", taxableValue: "--", vatRate: "--", vatAmount: -vdsDeductedByClients },
        { section: "অংশ ৭: সরকারি ট্রেজারিতে চূড়ান্ত প্রদেয় ভ্যাট", taxableValue: "--", vatRate: "--", vatAmount: netTreasuryPayable },
      ],
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 960 }}>
      {/* Header */}
      <div className="no-print" style={{ marginBottom: 24 }}>
        <Link href="/reports" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
          ← সকল রিপোর্টে ফিরে যান
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🏛️ এনবিআর ভ্যাট রিটার্ন ও মূসক-৯.১ রিপোর্ট (NBR VAT Return)</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              জাতীয় রাজস্ব বোর্ড (NBR) ও মূসক আইন ২০১২ অনুযায়ী সরকারি ফরম্যাটে মাসিক ভ্যাট রিটার্ন বিবরণী।
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleExport} className="btn-secondary">
              📥 Export CSV
            </button>
            <button onClick={() => window.print()} className="btn-primary">
              🖨️ প্রিন্ট মূসক-৯.১ ফরম
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট বিক্রয় সরবরাহ (Gross Sales)</span>
          <div className="stat-card-value">{formatCurrency(totalGrossSales)}</div>
          <div className="stat-card-sub">সেপ্টেম্বর ২০২৬ কর মেয়াদ</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সংগৃহীত আউটপুট ভ্যাট (Output VAT)</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatCurrency(totalOutputVat)}
          </div>
          <div className="stat-card-sub">বিক্রয়ের ওপর সংগৃহীত কর</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">রেয়াতযোগ্য ইনপুট ভ্যাট (Input Tax Rebate)</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {formatCurrency(totalInputVatRebate)}
          </div>
          <div className="stat-card-sub">ক্রয়ের ওপর পরিশোধিত কর সমন্বয়</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">ট্রেজারিতে নিট প্রদেয় ভ্যাট (Net Payable)</span>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {formatCurrency(netTreasuryPayable)}
          </div>
          <div className="stat-card-sub">উৎসে কর্তন (VDS) বাদ দিয়ে</div>
        </div>
      </div>

      {/* Interactive VAT Inclusive / Exclusive Calculator */}
      <div className="card no-print" style={{ marginBottom: 24, background: "var(--bg-subtle)", border: "1.5px solid var(--border-color)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>📐 ভ্যাট ইনক্লুসিভ / এক্সক্লুসিভ ক্যালকুলেটর (VAT Fraction Calculator)</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
          MRP মূল্য থেকে ভ্যাটের পরিমাণ আলাদা বা বেস মূল্যের সাথে ভ্যাট যোগ হিসাব করুন।
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: 14, alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>টাকার পরিমাণ (BDT)</label>
            <input
              type="number"
              min="1"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ভ্যাট হার (VAT %)</label>
            <select
              value={calcVatRate}
              onChange={(e) => setCalcVatRate(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "#fff", fontWeight: 700 }}
            >
              <option value={15}>15% (আদর্শ হার)</option>
              <option value={7.5}>7.5% (সুপারশপ)</option>
              <option value={5}>5% (ট্রেডার্স ভ্যাট)</option>
              <option value={0}>0% (অব্যাহতিপ্রাপ্ত)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>মূল্যের ধরন</label>
            <button
              type="button"
              onClick={() => setIsInclusive(!isInclusive)}
              className="btn-secondary"
              style={{ width: "100%", padding: "8px 0", fontSize: 12, fontWeight: 700 }}
            >
              {isInclusive ? "ভ্যাট সহ (Inclusive)" : "ভ্যাট ছাড়া (Exclusive)"}
            </button>
          </div>

          <div style={{ background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              মূল দাম: <b>{formatCurrency(calcBasePrice)}</b>
            </div>
            <div style={{ fontSize: 13, color: "var(--primary-dark)", fontWeight: 800 }}>
              ভ্যাট ({calcVatRate}%): <strong>{formatCurrency(calcVatPortion)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Government MUSHAK-9.1 Form Sheet */}
      <div className="card" style={{ padding: "36px 40px", boxShadow: "var(--shadow-lg)", background: "#ffffff" }}>
        {/* Government Header */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>জাতীয় রাজস্ব বোর্ড</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: "6px 0", color: "#1e1b4b" }}>
            মূল্য সংযোজন কর দাখিলপত্র (মূসক-৯.১)
          </h2>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>[বিধি ৪৭ এর উপ-বিধি (১) দ্রষ্টব্য — মূসক ও সম্পূরক শুল্ক আইন, ২০১২]</div>
          <span className="badge badge-neutral" style={{ marginTop: 8, fontSize: 12 }}>
            কর মেয়াদ: সেপ্টেম্বর ২০২৬ (০১/০৯/২০২৬ হতে ৩০/০৯/২০২৬)
          </span>
        </div>

        {/* Section 1 & 2: Taxpayer Details */}
        <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20, fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div>১. ব্যবসায় সনাক্তকরণ সংখ্যা (BIN): <strong style={{ fontFamily: "monospace", fontSize: 14, color: "#4338ca" }}>002918239-0101</strong></div>
              <div>২. করদাতার নাম: <strong>UNBEATABLE SUPER STORE LTD.</strong></div>
              <div>৩. ঠিকানা: <strong>রোড ৪, সেক্টর ৭, উত্তরা মডেল টাউন, ঢাকা-১২৩০</strong></div>
            </div>
            <div>
              <div>৪. অর্থনৈতিক কার্যক্রম: <strong>সুপার শপ, গ্রোসারি, কসমেটিকস ও হার্ডওয়্যার রিটেইল</strong></div>
              <div>৫. সংশ্লিষ্ট সার্কেল: <strong>উত্তরা সার্কেল, ঢাকা উত্তর কমিশনারেট</strong></div>
              <div>৬. দাখিলের ধরন: <strong>মূল দাখিলপত্র (Original Return)</strong></div>
            </div>
          </div>
        </div>

        {/* Section 3: Output Tax on Supplies (অংশ-৩: সরবরাহ বা বিক্রয়) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ background: "#eef2ff", padding: "8px 12px", borderRadius: 6, marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#3730a3" }}>অংশ-৩: পণ্য বা সেবা সরবরাহ (বিক্রয় ও আউটপুট কর)</h3>
          </div>

          <table className="erp-table" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th>পণ্য সরবরাহের বিবরণ ও হার</th>
                <th style={{ textAlign: "right" }}>মূল্য বা বেস ভ্যালু (BDT)</th>
                <th style={{ textAlign: "center" }}>ভ্যাট হার</th>
                <th style={{ textAlign: "right" }}>প্রদেয় আউটপুট ভ্যাট (BDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>১৫% আদর্শ হারে করযোগ্য পণ্য সরবরাহ</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(standardSales15)}</td>
                <td style={{ textAlign: "center" }}><span className="badge badge-neutral">15%</span></td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(outputVat15)}</td>
              </tr>
              <tr>
                <td>৭.৫% হ্রাসকৃত হারে রিটেইল সুপারশপ সরবরাহ</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(reducedSales75)}</td>
                <td style={{ textAlign: "center" }}><span className="badge badge-neutral">7.5%</span></td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(outputVat75)}</td>
              </tr>
              <tr>
                <td>ভ্যাট অব্যাহতিপ্রাপ্ত অত্যাবশ্যকীয় খাদ্যদ্রব্য</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(exemptSales)}</td>
                <td style={{ textAlign: "center" }}><span className="badge badge-success">0% Exempt</span></td>
                <td style={{ textAlign: "right" }}>৳ ০.০০</td>
              </tr>
              <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                <td>মোট সরবরাহ ও আউটপুট ভ্যাট (Total Output Tax)</td>
                <td style={{ textAlign: "right", color: "var(--primary)" }}>{formatCurrency(totalGrossSales)}</td>
                <td style={{ textAlign: "center" }}>--</td>
                <td style={{ textAlign: "right", color: "var(--primary)", fontSize: 14 }}>{formatCurrency(totalOutputVat)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Input Tax Credit (অংশ-৪: ক্রয় ও রেয়াত) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ background: "#ecfdf5", padding: "8px 12px", borderRadius: 6, marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#065f46" }}>অংশ-৪: ক্রয় ও ইনপুট ট্যাক্স রেয়াত (Input Tax Credit)</h3>
          </div>

          <table className="erp-table" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th>ক্রয় ও খরচের বিবরণ</th>
                <th style={{ textAlign: "right" }}>ক্রয় মূল্য (BDT)</th>
                <th style={{ textAlign: "center" }}>প্রযোজ্য হার</th>
                <th style={{ textAlign: "right" }}>রেয়াতযোগ্য ভ্যাট (BDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>১৫% আদর্শ হারে নিবন্ধিত স্থানীয় সরবরাহকারীদের নিকট থেকে ক্রয়</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(localTaxablePurchases15)}</td>
                <td style={{ textAlign: "center" }}><span className="badge badge-neutral">15%</span></td>
                <td style={{ textAlign: "right", fontWeight: 700, color: "var(--success)" }}>{formatCurrency(inputVatRebate15)}</td>
              </tr>
              <tr>
                <td>অনিবন্ধিত / অব্যাহতিপ্রাপ্ত উৎস থেকে ক্রয়</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(nonRebatePurchases)}</td>
                <td style={{ textAlign: "center" }}>--</td>
                <td style={{ textAlign: "right", color: "var(--text-muted)" }}>৳ ০.০০ (রেয়াত নেই)</td>
              </tr>
              <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                <td>সর্বমোট রেয়াতযোগ্য ইনপুট ট্যাক্স (Total Input Tax Rebate)</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(totalPurchases)}</td>
                <td style={{ textAlign: "center" }}>--</td>
                <td style={{ textAlign: "right", color: "var(--success)", fontSize: 14 }}>{formatCurrency(totalInputVatRebate)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5, 6, 7: Net Tax Calculation & Treasury Challan */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ background: "#fef3c7", padding: "8px 12px", borderRadius: 6, marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#92400e" }}>অংশ-৫ ও ৬: নিট প্রদেয় কর ও ট্রেজারি জমার বিবরণ</h3>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
              <span>ক. মোট আউটপুট কর (Total Output Tax):</span>
              <strong>{formatCurrency(totalOutputVat)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "var(--success)" }}>
              <span>খ. বাদ: মোট ইনপুট কর রেয়াত (Input Tax Credit):</span>
              <strong>- {formatCurrency(totalInputVatRebate)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderTop: "1px dashed #e2e8f0" }}>
              <span>গ. প্রদেয় নিট কর (Net Tax Payable):</span>
              <strong>{formatCurrency(grossPayableVat)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "var(--primary)" }}>
              <span>ঘ. বাদ: সরবরাহকারী কর্তৃক উৎসে কর্তিত ভ্যাট (VDS Deduction):</span>
              <strong>- {formatCurrency(vdsDeductedByClients)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #000", borderBottom: "2px solid #000", marginTop: 8, marginBottom: 12, fontSize: 16, fontWeight: 900, color: "#b91c1c" }}>
              <span>ঙ. সরকারি ট্রেজারিতে চূড়ান্ত প্রদেয় ভ্যাট (Final Treasury Payable):</span>
              <span>{formatCurrency(netTreasuryPayable)}</span>
            </div>

            <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 6, fontSize: 12, lineHeight: 1.6 }}>
              <div>🏛️ <b>ট্রেজারি চালান নম্বর:</b> <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{treasuryChallanNo}</span></div>
              <div>🏦 <b>ব্যাংকের নাম:</b> {challanBank} • <b>তারিখ:</b> {formatDate(challanDate)}</div>
              <div>✅ <b>ই-পেমেন্ট স্ট্যাটাস:</b> <span className="badge badge-success">TREASURY CLEARED</span></div>
            </div>
          </div>
        </div>

        {/* Section 8: Declaration & Signature */}
        <div style={{ borderTop: "1px dashed #94a3b8", paddingTop: 16, fontSize: 12, color: "#475569" }}>
          <div style={{ marginBottom: 24 }}>
            <b>ঘোষণাপত্র:</b> আমি নিশ্চিত করিতেছি যে, এই দাখিলপত্রে প্রদত্ত তথ্যসমূহ মূসক আইন ও বিধিমালার আলোকে সম্পূর্ণ সত্য ও সঠিক।
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div>তারিখ: <strong>{formatDate("2026-09-25")}</strong></div>
              <div>স্থান: <strong>ঢাকা, বাংলাদেশ</strong></div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: 180, borderBottom: "1px solid #000", marginBottom: 6 }} />
              <strong>স্বত্বাধিকারী / অনুমোদিত কর্মকর্তার স্বাক্ষর</strong>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ব্যবস্থাপনা পরিচালক, আনবিটেবল রিটেইল ইআরপি</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
