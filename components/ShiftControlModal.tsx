"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { IconPos, IconCheck, IconCash } from "./Icons";

export function ShiftControlModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
    setStatusMsg("✓ ক্যাশ ড্রয়ার শিফট সফলভাবে শুরু হয়েছে।");
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 700);
  };

  const handleCloseShift = () => {
    setShiftState("CLOSED");
    setStatusMsg("✓ শিফট সমাপ্ত ও ক্যাশ অডিট লগ সম্পন্ন হয়েছে।");
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
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          padding: 28,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
          border: "1px solid var(--border-color)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <IconPos size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>ক্যাশ ড্রয়ার ও শিফট কন্ট্রোল</h2>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>ক্যাশিয়ার শিফট ওপেন/ক্লোজ ও ক্যাশ অডিট</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid var(--border-color)",
              background: "var(--bg-subtle)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: 14,
              fontWeight: 700,
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
                padding: 16,
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>বর্তমান শিফট স্ট্যাটাস:</span>
                <span className="badge badge-success">● Active Shift Open</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>প্রারম্ভিক ক্যাশ (Opening Float):</span>
                <strong>{formatCurrency(openingCash)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid #cbd5e1", paddingTop: 8 }}>
                <span style={{ fontWeight: 600 }}>সিস্টেম ক্যাশ (Expected):</span>
                <strong style={{ color: "var(--primary-dark)", fontSize: 15 }}>{formatCurrency(expectedCash)}</strong>
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: "var(--text-main)" }}>
              শিফট সমাপ্ত ও ক্যাশ ড্রয়ার মিলকরণ:
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                ড্রয়ারে গণনাকৃত নগদ টাকা (Actual Cash ৳) *
              </label>
              <input
                type="number"
                value={closingActualCash || ""}
                onChange={(e) => setClosingActualCash(Number(e.target.value) || 0)}
                placeholder="যেমন: 14500"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid #cbd5e1",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--text-main)",
                }}
              />
            </div>

            {/* Cash Variance Box */}
            <div
              style={{
                padding: "10px 14px",
                background: variance === 0 ? "var(--success-bg)" : variance < 0 ? "var(--danger-bg)" : "var(--warning-bg)",
                border: `1px solid ${variance === 0 ? "var(--success-border)" : variance < 0 ? "var(--danger-border)" : "var(--warning-border)"}`,
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>ক্যাশ অমিল / পার্থক্য (Variance):</span>
              <strong style={{ color: variance < 0 ? "var(--danger-text)" : "var(--success-text)", fontSize: 15 }}>
                {variance > 0 ? `+${formatCurrency(variance)}` : formatCurrency(variance)}
              </strong>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                শিফট শেষের নোট (ঐচ্ছিক)
              </label>
              <input
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                placeholder="যেমন: ক্যাশ শর্টেজ বা খুচরা টাকার হিসাব"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid #cbd5e1",
                  fontSize: 13,
                }}
              />
            </div>

            {statusMsg && (
              <div style={{ color: "var(--success-text)", background: "var(--success-bg)", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, fontWeight: 700 }}>
                {statusMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn-secondary">বাতিল</button>
              <button onClick={handleCloseShift} className="btn-danger">
                ✓ ক্লোজ শিফট ও ড্রয়ার লক
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                নতুন শিফটের প্রারম্ভিক ক্যাশ (Opening Float ৳) *
              </label>
              <input
                type="number"
                value={openingCash || ""}
                onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                placeholder="2000.00"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid var(--primary)",
                  fontSize: 16,
                  fontWeight: 800,
                }}
              />
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                কাউন্টার চালু করার সময় ড্রয়ারে রাখা প্রারম্ভিক খুচরা টাকা।
              </span>
            </div>

            {statusMsg && (
              <div style={{ color: "var(--success-text)", background: "var(--success-bg)", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, fontWeight: 700 }}>
                {statusMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn-secondary">বাতিল</button>
              <button onClick={handleOpenShift} className="btn-primary">
                ⚡ নতুন শিফট ওপেন করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
