"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { IconPos } from "./Icons";

export function ShiftControlModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isBengali } = useLanguage();
  const [shiftState, setShiftState] = useState<"OPEN" | "CLOSED">("OPEN");
  const [openingCash, setOpeningCash] = useState<number>(2000);
  const [closingActualCash, setClosingActualCash] = useState<number>(0);
  const [expectedCash] = useState<number>(14500); // Demo expected
  const [shiftNote, setShiftNote] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const variance = closingActualCash - expectedCash;

  const handleOpenShift = () => {
    setShiftState("OPEN");
    setStatusMsg(
      isBengali
        ? "✓ ক্যাশ ড্রয়ার শিফট সফলভাবে শুরু হয়েছে।"
        : "✓ Cash drawer shift started successfully."
    );
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 700);
  };

  const handleCloseShift = () => {
    setShiftState("CLOSED");
    setStatusMsg(
      isBengali
        ? "✓ শিফট সমাপ্ত ও ক্যাশ অডিট লগ সম্পন্ন হয়েছে।"
        : "✓ Shift closed and cash audit recorded successfully."
    );
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 700);
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
        zIndex: 150,
        padding: 16,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: 480,
          padding: 24,
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          color: "var(--text-main)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Modal Header */}
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
              <IconPos size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)" }}>
                {isBengali ? "ক্যাশ ড্রয়ার ও শিফট কন্ট্রোল" : "Cash Drawer & Shift Control"}
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {isBengali ? "ক্যাশিয়ার শিফট ওপেন/ক্লোজ ও ক্যাশ অডিট" : "Cashier shift open/close & cash audit"}
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

        {shiftState === "OPEN" ? (
          <div>
            {/* Shift Status Summary Card */}
            <div
              style={{
                padding: 14,
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                  {isBengali ? "বর্তমান শিফট স্ট্যাটাস:" : "Current Shift Status:"}
                </span>
                <span className="badge badge-success">● Active Shift Open</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>
                  {isBengali ? "প্রারম্ভিক ক্যাশ (Opening Float):" : "Opening Float Cash:"}
                </span>
                <strong>{formatCurrency(openingCash)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid var(--border-color)", paddingTop: 8 }}>
                <span style={{ fontWeight: 600 }}>
                  {isBengali ? "সিস্টেম ক্যাশ (Expected):" : "System Expected Cash:"}
                </span>
                <strong style={{ color: "var(--primary)", fontSize: 15 }}>{formatCurrency(expectedCash)}</strong>
              </div>
            </div>

            <h3 style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 8, color: "var(--text-main)" }}>
              {isBengali ? "শিফট সমাপ্ত ও ক্যাশ ড্রয়ার মিলকরণ:" : "End Shift & Cash Drawer Reconciliation:"}
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--text-main)" }}>
                {isBengali ? "ড্রয়ারে গণনাকৃত নগদ টাকা (Actual Cash ৳) *" : "Counted Cash in Drawer (Actual Cash ৳) *"}
              </label>
              <input
                type="number"
                value={closingActualCash || ""}
                onChange={(e) => setClosingActualCash(Number(e.target.value) || 0)}
                placeholder={isBengali ? "যেমন: 14500" : "e.g. 14500"}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              />
            </div>

            {/* Cash Variance Box */}
            <div
              style={{
                padding: "9px 12px",
                background: variance === 0 ? "var(--success-bg)" : variance < 0 ? "var(--danger-bg)" : "var(--warning-bg)",
                border: `1px solid ${variance === 0 ? "var(--success-border)" : variance < 0 ? "var(--danger-border)" : "var(--warning-border)"}`,
                borderRadius: "var(--radius-md)",
                marginBottom: 14,
                fontSize: 12.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {isBengali ? "ক্যাশ অমিল / পার্থক্য (Variance):" : "Cash Variance / Discrepancy:"}
              </span>
              <strong style={{ color: variance < 0 ? "var(--danger-text)" : "var(--success-text)", fontSize: 14 }}>
                {variance > 0 ? `+${formatCurrency(variance)}` : formatCurrency(variance)}
              </strong>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--text-main)" }}>
                {isBengali ? "শিফট শেষের নোট (ঐচ্ছিক)" : "Shift Closing Note (Optional)"}
              </label>
              <input
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                placeholder={isBengali ? "যেমন: ক্যাশ শর্টেজ বা খুচরা টাকার হিসাব" : "e.g. Petty cash variance note"}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  fontSize: 13,
                }}
              />
            </div>

            {statusMsg && (
              <div style={{ color: "var(--success-text)", background: "var(--success-bg)", padding: 9, borderRadius: 6, fontSize: 12.5, marginBottom: 14, fontWeight: 700 }}>
                {statusMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn-secondary" style={{ padding: "8px 16px" }}>
                {isBengali ? "বাতিল" : "Cancel"}
              </button>
              <button onClick={handleCloseShift} className="btn-danger" style={{ padding: "8px 18px" }}>
                {isBengali ? "✓ ক্লোজ শিফট ও ড্রয়ার লক" : "✓ Close Shift & Lock Drawer"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4, color: "var(--text-main)" }}>
                {isBengali ? "নতুন শিফটের প্রারম্ভিক ক্যাশ (Opening Float ৳) *" : "New Shift Opening Float (৳) *"}
              </label>
              <input
                type="number"
                value={openingCash || ""}
                onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                placeholder="2000.00"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--primary)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              />
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                {isBengali
                  ? "কাউন্টার চালু করার সময় ড্রয়ারে রাখা প্রারম্ভিক খুচরা টাকা।"
                  : "Initial floating cash placed in the register at shift start."}
              </span>
            </div>

            {statusMsg && (
              <div style={{ color: "var(--success-text)", background: "var(--success-bg)", padding: 9, borderRadius: 6, fontSize: 12.5, marginBottom: 14, fontWeight: 700 }}>
                {statusMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn-secondary" style={{ padding: "8px 16px" }}>
                {isBengali ? "বাতিল" : "Cancel"}
              </button>
              <button onClick={handleOpenShift} className="btn-primary" style={{ padding: "8px 18px" }}>
                {isBengali ? "⚡ নতুন শিফট ওপেন করুন" : "⚡ Open Shift"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
