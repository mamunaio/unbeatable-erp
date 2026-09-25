"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShiftControlModal } from "./ShiftControlModal";
import { useAuth } from "./AuthProvider";

export function TopNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (pathname === "/pos" || pathname === "/login") return null;

  return (
    <>
      <header className="topbar">
        <div className="topbar-search">
          <span>🔍</span>
          <input placeholder="Search products, invoices, customers..." />
        </div>

        <div className="topbar-right">
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className="btn-secondary"
            style={{ padding: "7px 12px", fontSize: 13, gap: 6 }}
          >
            💵 Shift Control
          </button>
          <Link href="/pos" className="btn-primary" style={{ padding: "7px 14px", fontSize: 13 }}>
            ⚡ Open POS
          </Link>

          {/* User Profile & Switcher */}
          <div style={{ position: "relative" }}>
            <div
              className="user-profile"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="user-avatar">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                  {user?.name || "Admin User"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {user?.role || "OWNER"} • {user?.branchName || "Dhaka Branch"}
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
                  marginTop: 6,
                  width: 200,
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--border-color)",
                  padding: 8,
                  zIndex: 50,
                }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsUserMenuOpen(false)}
                  style={{ display: "block", padding: "8px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}
                >
                  🔄 Switch Role / User
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
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--danger)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ShiftControlModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </>
  );
}
