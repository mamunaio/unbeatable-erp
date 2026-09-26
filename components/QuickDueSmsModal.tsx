"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { IconSms, IconCheck, IconCustomers } from "./Icons";

interface DueCustomer {
  id: string;
  name: string;
  phone: string;
  dueAmount: number;
  lastInvoice?: string;
  invoiceDate?: string;
}

interface QuickDueSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: DueCustomer | null;
  shopName?: string;
}

export function QuickDueSmsModal({
  isOpen,
  onClose,
  customer,
  shopName = "Unbeatable Retail",
}: QuickDueSmsModalProps) {
  const { isBengali } = useLanguage();
  const defaultCustomer: DueCustomer = customer || {
    id: "c-1",
    name: "Kalam Store Wholesale",
    phone: "01812345678",
    dueAmount: 15400,
    lastInvoice: "INV-8921-1004",
    invoiceDate: "২৫ মিনিট আগে",
  };

  const getInitialMessage = () => {
    if (isBengali) {
      return `সম্মানিত ${defaultCustomer.name}, আপনার কাছে পূর্বের ইনভয়েস (${defaultCustomer.lastInvoice || "বকেয়া"}) বাবদ মোট ${formatCurrency(defaultCustomer.dueAmount)} বকেয়া পাওনা রয়েছে। অনুগ্রহপূর্বক দ্রুত পরিশোধ করার অনুরোধ করা হচ্ছে। ধন্যবাদ - ${shopName}`;
    } else {
      return `Dear ${defaultCustomer.name}, you have a pending due balance of ${formatCurrency(defaultCustomer.dueAmount)} for invoice (${defaultCustomer.lastInvoice || "Due"}). Please settle the outstanding amount soon. Thank you - ${shopName}`;
    }
  };

  const [message, setMessage] = useState(getInitialMessage());
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    setMessage(getInitialMessage());
  }, [isBengali, defaultCustomer.name, defaultCustomer.dueAmount, defaultCustomer.lastInvoice]);

  if (!isOpen) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        zIndex: 200,
        padding: 16,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: 500,
          padding: 24,
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          color: "var(--text-main)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-md)",
                background: "var(--primary-light)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
              }}
            >
              <IconSms size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)" }}>
                {isBengali ? "💬 বাকি আদায়ের তাগাদা SMS" : "💬 Due Collection Reminder SMS"}
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {isBengali ? "১-ক্লিকে কাস্টমারকে এসএমএস রিমাইন্ডার পাঠান" : "1-Click automated SMS dispatch"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid var(--border-color)",
              background: "var(--bg-subtle)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            ✕
          </button>
        </div>

        {/* Customer Summary Card */}
        <div
          style={{
            padding: 14,
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--danger-bg)",
                display: "grid",
                placeItems: "center",
                color: "var(--danger)",
              }}
            >
              <IconCustomers size={16} color="var(--danger)" />
            </div>
            <div>
              <strong style={{ fontSize: 13.5, display: "block" }}>{defaultCustomer.name}</strong>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                📱 {defaultCustomer.phone} {defaultCustomer.lastInvoice ? `• #${defaultCustomer.lastInvoice}` : ""}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>
              {isBengali ? "বকেয়া পাওনা" : "Total Due"}
            </span>
            <strong style={{ fontSize: 16, color: "var(--danger)", fontWeight: 800 }}>
              {formatCurrency(defaultCustomer.dueAmount)}
            </strong>
          </div>
        </div>

        {/* SMS Message Textarea */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: "var(--text-main)" }}>
            {isBengali ? "এসএমএস বার্তা (সম্পাদনাযোগ্য):" : "SMS Message (Editable):"}
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: 13.5,
              lineHeight: 1.5,
              resize: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11.5, color: "var(--text-muted)" }}>
            <span>{isBengali ? "১টি SMS ক্রেডিট প্রযোজ্য" : "1 SMS Credit Applicable"}</span>
            <span>{message.length} {isBengali ? "অক্ষর" : "chars"}</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {sentSuccess && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--success-bg)",
              border: "1px solid var(--success-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--success-text)",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <IconCheck size={16} color="var(--success-text)" />
            <span>
              {isBengali
                ? `✓ ${defaultCustomer.phone} নম্বরে তাগাদা এসএমএস সফলভাবে পাঠানো হয়েছে!`
                : `✓ Due reminder SMS sent successfully to ${defaultCustomer.phone}!`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: "9px 18px" }}>
            {isBengali ? "বাতিল" : "Cancel"}
          </button>
          <button
            onClick={handleSend}
            disabled={sending || sentSuccess}
            className="btn-primary"
            style={{ padding: "9px 20px" }}
          >
            <IconSms size={16} />
            <span>
              {sending
                ? isBengali
                  ? "পাঠানো হচ্ছে..."
                  : "Sending..."
                : sentSuccess
                ? isBengali
                  ? "পাঠানো সম্পন্ন ✓"
                  : "Sent Successfully ✓"
                : isBengali
                ? "💬 এসএমএস পাঠান"
                : "💬 Send SMS"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
