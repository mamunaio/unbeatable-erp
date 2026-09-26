"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShiftControlModal } from "./ShiftControlModal";
import { useAuth } from "./AuthProvider";
import { IconSearch, IconPos, IconBell, IconRefresh } from "./Icons";

export function TopNavbar({ onOpenCommandPalette }: { onOpenCommandPalette?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (pathname === "/pos" || pathname === "/login") return null;

  return (
    <>
      <header className="topbar">
        <div
          className="topbar-search"
          onClick={onOpenCommandPalette}
          style={{ cursor: "pointer" }}
        >
          <IconSearch size={16} color="var(--text-muted)" />
          <input
            readOnly
            placeholder="সার্চ করুন (ইনভয়েস, কাস্টমার, প্রোডাক্ট)..."
            style={{ cursor: "pointer" }}
          />
          <kbd>Ctrl+K</kbd>
        </div>

        <div className="topbar-right">
          {/* Quick Shift Control */}
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className="btn-secondary"
            style={{ padding: "7px 14px", fontSize: 13, gap: 8 }}
          >
            <span>💵 শিফট কন্ট্রোল</span>
          </button>

          {/* Direct POS Trigger */}
          <Link href="/pos" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13, gap: 6 }}>
            <IconPos size={16} />
            <span>Open POS</span>
          </Link>

          {/* Quick Notification Bell */}
          <button
            onClick={() => alert("🔔 নোটিফিকেশন: ১টি লো-স্টক অ্যালার্ট এবং ২টি নতুন পার্সেল ডেলিভারি পেন্ডিং রয়েছে।")}
            className="topbar-btn"
            title="Notifications"
          >
            <IconBell size={18} />
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 8,
                height: 8,
                background: "var(--danger)",
                borderRadius: "50%",
                border: "1.5px solid #fff",
              }}
            />
          </button>

          {/* User Profile & Switcher */}
          <div style={{ position: "relative" }}>
            <div
              className="user-profile"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="user-avatar">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div style={{ paddingRight: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", lineHeight: 1.2 }}>
                  {user?.name || "Admin User"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                  {user?.role || "OWNER"} • {user?.branchName || "Main Branch"}
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 8,
                  width: 210,
                  background: "#fff",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border-color)",
                  padding: 8,
                  zIndex: 60,
                  animation: "scaleIn 0.15s ease-out",
                }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsUserMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-main)",
                    transition: "background var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <IconRefresh size={15} color="var(--primary)" />
                  <span>রোল পরিবর্তন করুন</span>
                </Link>

                <div style={{ borderTop: "1px solid var(--border-color)", margin: "4px 0" }} />

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                    window.location.href = "/login";
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--danger)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "background var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>🚪 লগআউট (Sign Out)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SHIFT CONTROL POPUP MODAL */}
      <ShiftControlModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </>
  );
}
