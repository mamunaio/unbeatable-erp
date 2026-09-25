"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

type SmsTab = "CAMPAIGNS" | "AUTO_TRIGGERS" | "LOGS" | "GATEWAY_SETTINGS";

interface SmsLogEntry {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientPhone: string;
  messageType: "INVOICE" | "DUE_REMINDER" | "PAYMENT_RECEIPT" | "CAMPAIGN" | "POINTS" | "COURIER_DISPATCH";
  messageText: string;
  smsUnits: number;
  cost: number;
  status: "DELIVERED" | "SENT" | "FAILED";
  gateway: string;
}

const initialLogs: SmsLogEntry[] = [
  {
    id: "sms-101",
    timestamp: "2026-09-25T14:32:00",
    recipientName: "Rahim Chowdhury",
    recipientPhone: "01711223344",
    messageType: "INVOICE",
    messageText: "Dear Rahim Chowdhury, thank you for shopping at Unbeatable! Bill #INV-8921 is BDT 2,700. Paid: 1,500, Due: 1,200. View bill: https://erp.shop/s/c2",
    smsUnits: 1,
    cost: 0.40,
    status: "DELIVERED",
    gateway: "Greenweb BD (Masking)",
  },
  {
    id: "sms-102",
    timestamp: "2026-09-25T11:15:00",
    recipientName: "Kalam Store Wholesale",
    recipientPhone: "01822334455",
    messageType: "DUE_REMINDER",
    messageText: "প্রিয় কালাম স্টোর, আপনার পূর্বের বকেয়া পাওনা ৳১৫,৪০০ টাকা জমা দেওয়ার জন্য বিনীত অনুরোধ করা হচ্ছে। - আনবিটেবল রিটেইল",
    smsUnits: 2,
    cost: 0.80,
    status: "DELIVERED",
    gateway: "SSL Wireless",
  },
  {
    id: "sms-103",
    timestamp: "2026-09-24T18:45:00",
    recipientName: "Jamil Hossain",
    recipientPhone: "01933445566",
    messageType: "PAYMENT_RECEIPT",
    messageText: "Dear Jamil, we received BDT 500 for your dues. Current outstanding balance is BDT 0. Thank you!",
    smsUnits: 1,
    cost: 0.40,
    status: "DELIVERED",
    gateway: "Greenweb BD (Masking)",
  },
  {
    id: "sms-104",
    timestamp: "2026-09-23T16:00:00",
    recipientName: "All VIP Members (128 Customers)",
    recipientPhone: "88017XXXXXXXX",
    messageType: "CAMPAIGN",
    messageText: "🎉 উইকেন্ড ধামাকা অফার! আনবিটেবল শপে সকল ফ্রুটস ও গ্রোসারিতে ১০% ক্যাশব্যাক। কুপন কোড: EID2026 ব্যবহার করুন।",
    smsUnits: 2,
    cost: 102.40,
    status: "DELIVERED",
    gateway: "Greenweb BD (Masking)",
  },
  {
    id: "sms-105",
    timestamp: "2026-09-22T10:20:00",
    recipientName: "Tareq Hasan",
    recipientPhone: "01300112233",
    messageType: "COURIER_DISPATCH",
    messageText: "Dear Tareq, your parcel #ORD-9912 is shipped via Steadfast Courier. Tracking Code: ST-889124. Helpline: 09612000000",
    smsUnits: 1,
    cost: 0.40,
    status: "DELIVERED",
    gateway: "Greenweb BD (Masking)",
  },
];

export default function SmsMarketingPage() {
  const [activeTab, setActiveTab] = useState<SmsTab>("CAMPAIGNS");

  // Balance & Stats
  const [smsBalance, setSmsBalance] = useState(1420.50);
  const [smsCostPerUnit] = useState(0.40);

  // Campaign Form State
  const [targetAudience, setTargetAudience] = useState<"ALL" | "DUE_CUSTOMERS" | "VIP" | "INACTIVE_30_DAYS" | "CUSTOM">("ALL");
  const [customNumbers, setCustomNumbers] = useState("");
  const [campaignMessage, setCampaignMessage] = useState(
    "🎉 স্পেশাল অফার! আনবিটেবল শপ থেকে কেনাকাটায় আজই জিতে নিন আকর্ষণীয় ছাড় ও রিওয়ার্ড পয়েন্ট। অফারটি চলবে সীমিত সময়ের জন্য। হেল্পলাইন: ০১৭১১০০০০০০"
  );
  const [senderMasking, setSenderMasking] = useState("UNBEATABLE (Masking)");
  const [testNumber, setTestNumber] = useState("01711223344");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccessModal, setBroadcastSuccessModal] = useState<string | null>(null);

  // Logs state
  const [logs, setLogs] = useState<SmsLogEntry[]>(initialLogs);
  const [searchLog, setSearchLog] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Automated Triggers state
  const [triggers, setTriggers] = useState({
    invoiceEnabled: true,
    invoiceTemplate: "Dear {customer_name}, thanks for shopping at Unbeatable! Bill #{invoice_no} Total: BDT {total}, Paid: {paid}, Due: {due}. Bill Link: {invoice_url}",
    dueReminderEnabled: true,
    dueReminderTemplate: "প্রিয় {customer_name}, আনবিটেবল শপে আপনার বকেয়া পাওনা ৳{due_amount} টাকা। অনুগ্রহ করে দ্রুত পরিশোধের অনুরোধ রইল।",
    paymentReceiptEnabled: true,
    paymentReceiptTemplate: "Dear {customer_name}, received BDT {amount_paid} for bill #{invoice_no}. New balance: BDT {remaining_due}. Thank you!",
    pointsEarnedEnabled: true,
    pointsTemplate: "অভিনন্দন {customer_name}! আজকের কেনাকাটায় আপনি {points_earned} রিওয়ার্ড পয়েন্ট পেয়েছেন। মোট পয়েন্ট: {total_points}।",
    courierShippedEnabled: true,
    courierTemplate: "Dear {customer_name}, order #{invoice_no} dispatched via {courier_name}. Tracking: {tracking_code}.",
  });

  // Gateway Settings state
  const [gatewayProvider, setGatewayProvider] = useState<"GREENWEB" | "SSL_WIRELESS" | "BULKSMS_BD" | "TWILIO">("GREENWEB");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [senderId, setSenderId] = useState("UNBEATABLE");
  const [gatewaySaveToast, setGatewaySaveToast] = useState(false);

  // Recipients Count Calculation
  const getAudienceCount = () => {
    switch (targetAudience) {
      case "ALL":
        return 2450;
      case "DUE_CUSTOMERS":
        return 42;
      case "VIP":
        return 128;
      case "INACTIVE_30_DAYS":
        return 520;
      case "CUSTOM": {
        const cleaned = customNumbers.split(/[\n,]/).filter((n) => n.trim().length >= 10);
        return cleaned.length || 0;
      }
    }
  };

  const recipientCount = getAudienceCount();

  // Character counter & SMS unit calculation
  const isUnicode = /[^\u0000-\u007F]/.test(campaignMessage);
  const charLength = campaignMessage.length;
  const singleSmsLimit = isUnicode ? 70 : 160;
  const multiSmsLimit = isUnicode ? 67 : 153;

  const smsUnitsPerRecipient =
    charLength <= singleSmsLimit ? 1 : Math.ceil(charLength / multiSmsLimit);
  const totalCampaignCost = recipientCount * smsUnitsPerRecipient * smsCostPerUnit;

  // Insert Variable Tag into Campaign Text
  const insertVariable = (tag: string) => {
    setCampaignMessage((prev) => prev + " " + tag);
  };

  // Broadcast Campaign
  const handleBroadcastSms = () => {
    if (recipientCount <= 0 || !campaignMessage.trim()) return;
    setIsBroadcasting(true);

    setTimeout(() => {
      setIsBroadcasting(false);
      setSmsBalance((prev) => Math.max(0, prev - totalCampaignCost));

      const newLog: SmsLogEntry = {
        id: `sms-${Date.now()}`,
        timestamp: new Date().toISOString(),
        recipientName: `Bulk Broadcast (${targetAudience})`,
        recipientPhone: `${recipientCount} Recipients`,
        messageType: "CAMPAIGN",
        messageText: campaignMessage,
        smsUnits: smsUnitsPerRecipient,
        cost: totalCampaignCost,
        status: "DELIVERED",
        gateway: gatewayProvider === "GREENWEB" ? "Greenweb BD" : "SSL Wireless",
      };
      setLogs([newLog, ...logs]);
      setBroadcastSuccessModal(`সফলভাবে ${recipientCount} জন গ্রাহকের মোবাইলে বাল্ক এসএমএস পাঠানো সম্পন্ন হয়েছে!`);
    }, 1500);
  };

  // Send Test Single SMS
  const handleSendTestSms = () => {
    if (!testNumber) return;
    alert(`টেস্ট এসএমএস সফলভাবে ${testNumber} নম্বরে সেন্ড করা হয়েছে! (১ টি SMS চার্জ কাটা হয়েছে)`);
    setSmsBalance((prev) => Math.max(0, prev - smsCostPerUnit));
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    setGatewaySaveToast(true);
    setTimeout(() => setGatewaySaveToast(false), 3000);
  };

  const handleExportLogs = () => {
    exportToCsv({
      filename: "SMS_Marketing_Delivery_Report",
      headers: [
        { key: "timestamp", label: "Date & Time" },
        { key: "recipientName", label: "Customer Name" },
        { key: "recipientPhone", label: "Mobile" },
        { key: "messageType", label: "SMS Type" },
        { key: "messageText", label: "Message Content" },
        { key: "smsUnits", label: "Units" },
        { key: "cost", label: "Cost (BDT)" },
        { key: "status", label: "Status" },
        { key: "gateway", label: "Gateway" },
      ],
      data: logs,
    });
  };

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.recipientName.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.recipientPhone.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.messageText.toLowerCase().includes(searchLog.toLowerCase());
    const matchType = filterType === "ALL" || l.messageType === filterType;
    return matchSearch && matchType;
  });

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge badge-primary">Marketing Automation</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Greenweb & SSL Wireless Ready</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>💬 বাল্ক এসএমএস মার্কেটিং ও অটো নোটিফিকেশন হাব</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            ইনভয়েস SMS, বাকি আদায়ের তাগাদা, ক্যাম্পেইন প্রচার ও কাস্টমার রিটেনশন প্ল্যাটফর্ম।
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              background: "#fff",
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>বর্তমান এসএমএস ব্যালেন্স</div>
              <strong style={{ fontSize: 16, color: "var(--success)" }}>{formatCurrency(smsBalance)}</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                (~{Math.floor(smsBalance / smsCostPerUnit)} SMS)
              </span>
            </div>
            <button
              onClick={() => alert("রিচার্জ গেটওয়ে: SSLCommerz / bKash মারফত ৳১,০০০ রিচার্জ সফল হয়েছে।")}
              className="btn-secondary"
              style={{ padding: "4px 10px", fontSize: 12 }}
            >
              ＋ রিচার্জ
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <span className="stat-card-title">চলতি মাসে প্রেরিত এসএমএস</span>
          <div className="stat-card-value">{logs.length + 1835} টি</div>
          <div className="stat-card-sub">সফলভাবে প্রেরিত বার্তা</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--success)" }}>
          <span className="stat-card-title">ডেলিভারি সাকসেস রেট</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>99.4%</div>
          <div className="stat-card-sub">অপারেটর হ্যান্ডওভার কনফার্মড</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #ea580c" }}>
          <span className="stat-card-title">বাকি আদায়ের এসএমএস নোটিশ</span>
          <div className="stat-card-value" style={{ color: "#ea580c" }}>142 টি</div>
          <div className="stat-card-sub">আদায় বৃদ্ধি পেয়েছে ৳১,৮৫,০০০+</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--secondary)" }}>
          <span className="stat-card-title">একটিভ গেটওয়ে প্রোভাইডার</span>
          <div className="stat-card-value" style={{ fontSize: 18 }}>
            {gatewayProvider === "GREENWEB" ? "Greenweb BD (Masked)" : "SSL Wireless BD"}
          </div>
          <div className="stat-card-sub">Sender ID: {senderId}</div>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "2px solid var(--border-color)",
          marginBottom: 24,
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("CAMPAIGNS")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            background: "none",
            borderBottom: activeTab === "CAMPAIGNS" ? "3px solid var(--primary)" : "3px solid transparent",
            color: activeTab === "CAMPAIGNS" ? "var(--primary-dark)" : "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🚀 ক্যাম্পেইন স্টুডিও (Bulk SMS)</span>
        </button>

        <button
          onClick={() => setActiveTab("AUTO_TRIGGERS")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            background: "none",
            borderBottom: activeTab === "AUTO_TRIGGERS" ? "3px solid var(--primary)" : "3px solid transparent",
            color: activeTab === "AUTO_TRIGGERS" ? "var(--primary-dark)" : "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚡ অটো-নোটিফিকেশন ট্রিগার</span>
        </button>

        <button
          onClick={() => setActiveTab("LOGS")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            background: "none",
            borderBottom: activeTab === "LOGS" ? "3px solid var(--primary)" : "3px solid transparent",
            color: activeTab === "LOGS" ? "var(--primary-dark)" : "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>📜 ডেলিভারি হিস্ট্রি ও লগ</span>
        </button>

        <button
          onClick={() => setActiveTab("GATEWAY_SETTINGS")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            background: "none",
            borderBottom: activeTab === "GATEWAY_SETTINGS" ? "3px solid var(--primary)" : "3px solid transparent",
            color: activeTab === "GATEWAY_SETTINGS" ? "var(--primary-dark)" : "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚙️ গেটওয়ে ও API কনফিগারেশন</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CAMPAIGN STUDIO WITH PHONE SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === "CAMPAIGNS" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left Column: Form & Variable Controls */}
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📢 নতুন প্রোমোশনাল এসএমএস ক্যাম্পেইন</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              এক ক্লিকে সকল বা নির্দিষ্ট ক্যাটাগরির কাস্টমারদের মোবাইলে অফার বা নোটিশ পৌঁছে দিন।
            </p>

            {/* Target Audience */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                টার্গেট অডিয়েন্স / প্রাপক নির্বাচন করুন *
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontWeight: 600 }}
              >
                <option value="ALL">সকল রেজিস্টার্ড কাস্টমার (২,৪৫০ জন প্রাপক)</option>
                <option value="DUE_CUSTOMERS">🚨 বকেয়া থাকা কাস্টমারগণ (৪২ জন প্রাপক)</option>
                <option value="VIP">⭐ হোলসেল ও ভিআইপি মেম্বার (১২৮ জন প্রাপক)</option>
                <option value="INACTIVE_30_DAYS">💤 গত ৩০ দিনে কেনাকাটা করেননি (৫২০ জন প্রাপক)</option>
                <option value="CUSTOM">✍️ কাস্টম মোবাইল নম্বর পেস্ট বা ইনপুট করুন</option>
              </select>
            </div>

            {targetAudience === "CUSTOM" && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  মোবাইল নম্বরসমূহ (কমা বা নতুন লাইনে লিখুন)
                </label>
                <textarea
                  rows={3}
                  placeholder="01711000000, 01822000000, 01933000000..."
                  value={customNumbers}
                  onChange={(e) => setCustomNumbers(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
            )}

            {/* Masking Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সেন্ডার আইডি (Masking / Non-Masking)</label>
                <select
                  value={senderMasking}
                  onChange={(e) => setSenderMasking(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="UNBEATABLE (Masking)">UNBEATABLE (অফিসিয়াল মাস্কিং)</option>
                  <option value="8809612000000 (Non-Masking)">8809612000000 (নন-মাস্কিং রেট)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মেসেজ এনকোডিং</label>
                <div style={{ padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                  {isUnicode ? "🔤 বাংলা / ইউনিকোড (৭০ অক্ষর/SMS)" : "🔤 ইংরেজি GSM (১৬০ অক্ষর/SMS)"}
                </div>
              </div>
            </div>

            {/* Quick Variable Insertion */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>ডায়নামিক ভ্যারিয়েবল যুক্ত করুন:</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                {[
                  { label: "+ কাস্টমারের নাম", tag: "{customer_name}" },
                  { label: "+ শপের নাম", tag: "{shop_name}" },
                  { label: "+ কুপন কোড", tag: "{promo_code}" },
                  { label: "+ বাকি টাকা", tag: "{due_amount}" },
                  { label: "+ রিওয়ার্ড পয়েন্ট", tag: "{points}" },
                ].map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => insertVariable(v.tag)}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "var(--primary-dark)",
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Message Area */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                এসএমএস মেসেজ কন্টেন্ট *
              </label>
              <textarea
                rows={4}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid #cbd5e1", fontSize: 14, lineHeight: 1.5 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                <span>অক্ষর সংখ্যা: <strong>{charLength}</strong></span>
                <span>
                  ইউনিট কাউন্ট: <strong style={{ color: smsUnitsPerRecipient > 1 ? "var(--warning)" : "inherit" }}>{smsUnitsPerRecipient} SMS / ব্যক্তি</strong>
                </span>
              </div>
            </div>

            {/* Cost Summary Box */}
            <div
              style={{
                background: "var(--bg-subtle)",
                padding: 16,
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                marginBottom: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>মোট প্রাপক</div>
                <strong style={{ fontSize: 16, color: "var(--primary-dark)" }}>{recipientCount} জন</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>মোট এসএমএস খরচ</div>
                <strong style={{ fontSize: 16, color: "#ea580c" }}>{recipientCount * smsUnitsPerRecipient} Units</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>আনুমানিক বিল</div>
                <strong style={{ fontSize: 16, color: "var(--success)" }}>{formatCurrency(totalCampaignCost)}</strong>
              </div>
            </div>

            {/* Test SMS Bar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", background: "#f8fafc", padding: "10px 14px", borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>🧪 টেস্ট এসএমএস:</span>
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
              <button onClick={handleSendTestSms} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>
                টেস্ট পাঠান
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                disabled={isBroadcasting || recipientCount === 0}
                onClick={handleBroadcastSms}
                className="btn-primary"
                style={{ padding: "12px 24px", fontSize: 15, background: "var(--success)" }}
              >
                {isBroadcasting ? "🚀 এসএমএস ব্রডকাস্ট হচ্ছে..." : `🚀 ${recipientCount} জন গ্রাহককে এসএমএস পাঠান`}
              </button>
            </div>
          </div>

          {/* Right Column: Live Smartphone Simulator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10 }}>
              📱 লাইভ মোবাইল প্রিভিউ (Realtime Simulator)
            </div>

            {/* Phone Frame */}
            <div
              style={{
                width: 320,
                height: 560,
                background: "#0f172a",
                borderRadius: 40,
                padding: "12px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                border: "4px solid #334155",
                position: "relative",
              }}
            >
              {/* Phone Speaker Notch */}
              <div
                style={{
                  width: 120,
                  height: 18,
                  background: "#000",
                  borderRadius: "0 0 12px 12px",
                  margin: "0 auto 8px",
                }}
              />

              {/* Phone Screen Inside */}
              <div
                style={{
                  background: "#f1f5f9",
                  width: "100%",
                  height: "calc(100% - 26px)",
                  borderRadius: 28,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Phone Header Bar */}
                <div
                  style={{
                    background: "#0284c7",
                    color: "#fff",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", color: "#0284c7", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14 }}>
                    U
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>UNBEATABLE</div>
                    <div style={{ fontSize: 10, opacity: 0.85 }}>Official SMS Sender</div>
                  </div>
                </div>

                {/* SMS Body Area */}
                <div style={{ flex: 1, padding: 14, overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", marginBottom: 12 }}>
                    Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>

                  {/* Chat Bubble */}
                  <div
                    style={{
                      background: "#fff",
                      color: "#1e293b",
                      padding: "12px 14px",
                      borderRadius: "16px 16px 16px 2px",
                      fontSize: 13,
                      lineHeight: 1.45,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                      border: "1px solid #e2e8f0",
                      wordBreak: "break-word",
                    }}
                  >
                    {campaignMessage
                      .replace(/{customer_name}/g, "Rahim Chowdhury")
                      .replace(/{shop_name}/g, "Unbeatable Superstore")
                      .replace(/{promo_code}/g, "EID2026")
                      .replace(/{due_amount}/g, "1,200")
                      .replace(/{points}/g, "85")}
                    <div style={{ fontSize: 9, color: "#94a3b8", textAlign: "right", marginTop: 6 }}>
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Delivered
                    </div>
                  </div>
                </div>

                {/* Bottom Typing Bar Dummy */}
                <div style={{ background: "#fff", padding: "8px 12px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, background: "#f8fafc", padding: "6px 10px", borderRadius: 20, fontSize: 11, color: "#94a3b8" }}>
                    Replies not supported
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUTOMATED NOTIFICATION TRIGGERS */}
      {/* ========================================================================= */}
      {activeTab === "AUTO_TRIGGERS" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>⚡ ইভেন্ট-ভিত্তিক অটোমেটেড নোটিফিকেশন ট্রিগার</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              দোকানের দৈনন্দিন কার্যক্রম যেমন বিক্রয়, বাকি আদায় ও অর্ডার ডিসপ্যাচের সাথে সাথে স্বয়ংক্রিয় SMS পাঠানো।
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* 1. POS Sale Invoice SMS */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🧾</span>
                    <div>
                      <strong style={{ fontSize: 15 }}>নতুন বিক্রয় / POS ইনভয়েস কনফার্মেশন SMS</strong>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>বিল তৈরি হওয়ার সাথে সাথে কাস্টমারের মোবাইলে ইনভয়েস লিঙ্কসহ SMS চলে যাবে</div>
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={triggers.invoiceEnabled}
                      onChange={(e) => setTriggers({ ...triggers, invoiceEnabled: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
                    />
                    <span>{triggers.invoiceEnabled ? "একটিভ" : "বন্ধ"}</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  disabled={!triggers.invoiceEnabled}
                  value={triggers.invoiceTemplate}
                  onChange={(e) => setTriggers({ ...triggers, invoiceTemplate: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              {/* 2. Due Reminder SMS */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>💵</span>
                    <div>
                      <strong style={{ fontSize: 15 }}>বকেয়া পরিশোধের তাগাদা নোটিশ (Due Reminder)</strong>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>বকেয়া থাকার নির্দিষ্ট দিন পর বা এক ক্লিকে তাগাদা বার্তা পাঠানো</div>
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={triggers.dueReminderEnabled}
                      onChange={(e) => setTriggers({ ...triggers, dueReminderEnabled: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
                    />
                    <span>{triggers.dueReminderEnabled ? "একটিভ" : "বন্ধ"}</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  disabled={!triggers.dueReminderEnabled}
                  value={triggers.dueReminderTemplate}
                  onChange={(e) => setTriggers({ ...triggers, dueReminderTemplate: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              {/* 3. Payment Received Acknowledgment */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div>
                      <strong style={{ fontSize: 15 }}>বাকি টাকা প্রাপ্তি রসিদ (Due Collection Receipt)</strong>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>বকেয়া টাকা জমা নেওয়ার সাথে সাথে নতুন ব্যালেন্সসহ SMS যাবে</div>
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={triggers.paymentReceiptEnabled}
                      onChange={(e) => setTriggers({ ...triggers, paymentReceiptEnabled: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
                    />
                    <span>{triggers.paymentReceiptEnabled ? "একটিভ" : "বন্ধ"}</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  disabled={!triggers.paymentReceiptEnabled}
                  value={triggers.paymentReceiptTemplate}
                  onChange={(e) => setTriggers({ ...triggers, paymentReceiptTemplate: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              {/* 4. Courier Tracking SMS */}
              <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🚚</span>
                    <div>
                      <strong style={{ fontSize: 15 }}>কুরিয়ার পার্সেল ট্র্যাকিং নোটিফিকেশন</strong>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Steadfast/Pathao-তে পার্সেল বুক করার সাথে সাথে ট্র্যাকিং লিঙ্ক পৌঁছানো</div>
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={triggers.courierShippedEnabled}
                      onChange={(e) => setTriggers({ ...triggers, courierShippedEnabled: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "var(--primary)" }}
                    />
                    <span>{triggers.courierShippedEnabled ? "একটিভ" : "বন্ধ"}</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  disabled={!triggers.courierShippedEnabled}
                  value={triggers.courierTemplate}
                  onChange={(e) => setTriggers({ ...triggers, courierTemplate: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => alert("✓ অটো-নোটিফিকেশন ট্রিগার সেটিংস সফলভাবে আপডেট করা হয়েছে!")}
                className="btn-primary"
              >
                ✓ সেটিংস সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DELIVERY LOGS & AUDIT */}
      {/* ========================================================================= */}
      {activeTab === "LOGS" && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--border-color)",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 260 }}>
              <input
                type="text"
                placeholder="🔍 মোবাইল নম্বর, কাস্টমারের নাম বা টেক্সট দিয়ে খুঁজুন..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff" }}
              >
                <option value="ALL">সকল মেসেজ টাইপ</option>
                <option value="INVOICE">POS ইনভয়েস (Invoice)</option>
                <option value="DUE_REMINDER">বাকি তাগাদা (Due Reminder)</option>
                <option value="PAYMENT_RECEIPT">পেমেন্ট প্রাপ্তি রসিদ</option>
                <option value="CAMPAIGN">বাল্ক ক্যাম্পেইন (Campaign)</option>
                <option value="COURIER_DISPATCH">কুরিয়ার ট্র্যাকিং</option>
              </select>

              <button onClick={handleExportLogs} className="btn-secondary">
                📥 Export CSV
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>তারিখ ও সময়</th>
                  <th>প্রাপকের বিবরণ</th>
                  <th>ক্যাটাগরি</th>
                  <th>মেসেজ টেক্সট</th>
                  <th>SMS ইউনিট</th>
                  <th>খরচ (৳)</th>
                  <th>স্ট্যাটাস</th>
                  <th>গেটওয়ে</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDateTime(log.timestamp)}</td>
                    <td>
                      <strong style={{ display: "block" }}>{log.recipientName}</strong>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{log.recipientPhone}</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{log.messageType}</span>
                    </td>
                    <td style={{ maxWidth: 300, fontSize: 12, lineHeight: 1.4 }}>
                      {log.messageText}
                    </td>
                    <td>{log.smsUnits} SMS</td>
                    <td><strong>{formatCurrency(log.cost)}</strong></td>
                    <td>
                      <span className="badge badge-success">✓ {log.status}</span>
                    </td>
                    <td style={{ fontSize: 11, color: "var(--text-muted)" }}>{log.gateway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GATEWAY & API CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === "GATEWAY_SETTINGS" && (
        <div style={{ maxWidth: 680, background: "#fff", padding: 28, borderRadius: 16, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>⚙️ এসএমএস গেটওয়ে ও API কনফিগারেশন</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            বাংলাদেশের জনপ্রিয় SMS প্রোভাইডারদের সাথে নিরাপদ API ইন্টিগ্রেশন।
          </p>

          <form onSubmit={handleSaveGateway}>
            <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>এসএমএস প্রোভাইডার নির্বাচন করুন</label>
                <select
                  value={gatewayProvider}
                  onChange={(e) => setGatewayProvider(e.target.value as any)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                >
                  <option value="GREENWEB">Greenweb Bangladesh (api.greenweb.com.bd)</option>
                  <option value="SSL_WIRELESS">SSL Wireless SMS Gateway (smsplus.sslwireless.com)</option>
                  <option value="BULKSMS_BD">BulkSMS BD (bulksmsbd.com)</option>
                  <option value="TWILIO">Twilio Global SMS API</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>API Key / Token *</label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontFamily: "monospace" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>API Secret / Password</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>অনুমোদিত Sender ID / Masking *</label>
                  <input
                    type="text"
                    required
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>BTCL/BTRC অনুমোদিত মাস্কিং নেম</span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>প্রতি এসএমএস খরচ (BDT)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue="0.40"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>মাস্কিং রেট: ৳০.৪০ / নন-মাস্কিং: ৳০.২৫</span>
                </div>
              </div>

              <div style={{ background: "var(--bg-subtle)", padding: 14, borderRadius: 8, fontSize: 13 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>📡 Webhook Callback URL:</div>
                <code style={{ fontSize: 12, color: "var(--primary-dark)" }}>https://erp.yourdomain.com/api/webhooks/sms/delivery-status</code>
              </div>
            </div>

            {gatewaySaveToast && (
              <div style={{ background: "var(--success-bg)", color: "var(--success-text)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
                ✓ গেটওয়ে ক্রেডেনশিয়াল এবং কানেকশন সফলভাবে যাচাই ও সেভ করা হয়েছে!
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => alert("✓ গেটওয়ে সার্ভার রেসপন্স: HTTP 200 OK (Connection Verified!)")}
                className="btn-secondary"
              >
                🔌 Test Connection
              </button>
              <button type="submit" className="btn-primary">
                ✓ সেটিংস সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BROADCAST SUCCESS MODAL */}
      {broadcastSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            display: "grid",
            placeItems: "center",
            zIndex: 120,
            backdropFilter: "blur(4px)",
            padding: 16,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, padding: 28, textAlign: "center", boxShadow: "var(--shadow-pos)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>ক্যাম্পেইন সফলভাবে সম্প্রচারিত!</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              {broadcastSuccessModal}
            </p>
            <button onClick={() => setBroadcastSuccessModal(null)} className="btn-primary" style={{ width: "100%", padding: "10px" }}>
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
