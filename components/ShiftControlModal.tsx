"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

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
    setStatusMsg("ক্যাশ ড্রয়ার শিফট সফলভাবে শুরু হয়েছে।");
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 800);
  };

  const handleCloseShift = () => {
    setShiftState("CLOSED");
    setStatusMsg("শিফট সমাপ্ত ও ক্যাশ ভেরিয়েন্স অডিট লগ সম্পন্ন হয়েছে।");
    setTimeout(() => {
      setStatusMsg("");
      onClose();
    }, 800);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", display: "grid", placeItems: "center", zIndex: 120, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#ffffff", borderRadius: 16, width: "100%", maxWidth: 460, padding: 24, boxShadow: "var(--shadow-pos)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>💵 ক্যাশ ড্রয়ার ও শিফট কন্ট্রোল</h2>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>ক্যাশিয়ার শিফট ওপেন/ক্লোজ ও ক্যাশ অডিট</span>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        {shiftState === "OPEN" ? (
          <div>
            <div style={{ padding: 14, background: "var(--bg-subtle)", borderRadius: 10, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span>বর্তমান শিফট স্ট্যাটাস:</span>
                <span className="badge badge-success">Active Open</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span>ওপেনিং ক্যাশ:</span>
                <strong>{formatCurrency(openingCash)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>সিস্টেম ক্যালকুলেটেড ক্যাশ (Expected):</span>
                <strong style={{ color: "var(--primary-dark)" }}>{formatCurrency(expectedCash)}</strong>
              </div>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>শিফট সমাপ্ত ও ক্যাশ ড্রয়ার মিলকরণ (Close Shift):</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ড্রয়ারে গণনাকৃত নগদ টাকা (Actual Cash ৳) *</label>
              <input
                type="number"
                value={closingActualCash || ""}
                onChange={(e) => setClosingActualCash(Number(e.target.value) || 0)}
                placeholder="0.00"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "2px solid #cbd5e1", fontSize: 16, fontWeight: 700 }}
              />
            </div>

            <div style={{ padding: "8px 12px", background: variance === 0 ? "var(--success-bg)" : "var(--warning-bg)", borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
              <span>ক্যাশ অমিল / পার্থক্য (Variance): </span>
              <strong style={{ color: variance < 0 ? "var(--danger)" : "var(--success)" }}>
                {variance > 0 ? `+${formatCurrency(variance)}` : formatCurrency(variance)}
              </strong>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>মন্তব্য (Optional Note)</label>
              <input
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                placeholder="শিফট শেষের নোট বা অমিলের ব্যাখ্যা"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>

            {statusMsg && <div style={{ color: "var(--success)", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{statusMsg}</div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn-secondary">বাতিল</button>
              <button onClick={handleCloseShift} className="btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)" }}>
                ✓ ক্লোজ শিফট ও লক
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>নতুন শিফটের প্রারম্ভিক ক্যাশ (Opening Float ৳) *</label>
              <input
                type="number"
                value={openingCash || ""}
                onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
                placeholder="2000.00"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "2px solid var(--primary)", fontSize: 16, fontWeight: 700 }}
              />
            </div>

            {statusMsg && <div style={{ color: "var(--success)", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{statusMsg}</div>}

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
