"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, RoleType } from "./AuthProvider";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DictionaryKey } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  dictKey: DictionaryKey;
  defaultLabel: string;
  href: string;
  icon: string;
  isPos?: boolean;
  roles?: RoleType[];
}

const navigationItems: NavItem[] = [
  { dictKey: "nav_dashboard", defaultLabel: "Dashboard", href: "/dashboard", icon: "📊", roles: ["OWNER", "ADMIN", "MANAGER", "ACCOUNTANT"] },
  { dictKey: "nav_pos", defaultLabel: "POS Counter", href: "/pos", icon: "⚡", isPos: true },
  { dictKey: "nav_products", defaultLabel: "Products Catalog", href: "/products", icon: "📦", roles: ["OWNER", "ADMIN", "MANAGER", "STOCK_KEEPER", "CASHIER"] },
  { dictKey: "nav_special_addons", defaultLabel: "Special Add-ons", href: "/products/special-addons", icon: "🔬", roles: ["OWNER", "ADMIN", "MANAGER", "STOCK_KEEPER"] },
  { dictKey: "nav_inventory", defaultLabel: "Inventory Ledger", href: "/inventory", icon: "📑", roles: ["OWNER", "ADMIN", "MANAGER", "STOCK_KEEPER"] },
  { dictKey: "nav_sales", defaultLabel: "Sales & Invoices", href: "/sales", icon: "🧾", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"] },
  { dictKey: "nav_promotions", defaultLabel: "Coupons & Offers", href: "/promotions", icon: "🎟️", roles: ["OWNER", "ADMIN", "MANAGER"] },
  { dictKey: "nav_marketing", defaultLabel: "SMS & Marketing", href: "/marketing/sms", icon: "💬", roles: ["OWNER", "ADMIN", "MANAGER"] },
  { dictKey: "nav_logistics", defaultLabel: "Courier & Logistics", href: "/logistics", icon: "🚚", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"] },
  { dictKey: "nav_purchases", defaultLabel: "Purchases", href: "/purchases", icon: "🛒", roles: ["OWNER", "ADMIN", "MANAGER", "STOCK_KEEPER"] },
  { dictKey: "nav_customers", defaultLabel: "Customers", href: "/customers", icon: "👥", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"] },
  { dictKey: "nav_suppliers", defaultLabel: "Suppliers", href: "/suppliers", icon: "🏭", roles: ["OWNER", "ADMIN", "MANAGER"] },
  { dictKey: "nav_expenses", defaultLabel: "Expenses / Cash", href: "/expenses", icon: "💵", roles: ["OWNER", "ADMIN", "ACCOUNTANT"] },
  { dictKey: "nav_bank_accounts", defaultLabel: "Bank & Accounts", href: "/accounting/bank-accounts", icon: "🏦", roles: ["OWNER", "ADMIN", "ACCOUNTANT"] },
  { dictKey: "nav_hr", defaultLabel: "HR & Staff", href: "/hr", icon: "👔", roles: ["OWNER", "ADMIN", "MANAGER"] },
  { dictKey: "nav_reports", defaultLabel: "Reports & Profit", href: "/reports", icon: "📈", roles: ["OWNER", "ADMIN", "MANAGER", "ACCOUNTANT"] },
  { dictKey: "nav_settings", defaultLabel: "Settings", href: "/settings", icon: "⚙️", roles: ["OWNER", "ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();
  const { t } = useLanguage();

  // If in POS view or Login view, hide full sidebar
  if (pathname === "/pos" || pathname === "/login") return null;

  return (
    <aside className="sidebar">
      <div className="brand-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="brand-badge">U</div>
          <div>
            <div className="brand-title">{t("appName")}</div>
            <div className="brand-subtitle">{t("appSubtitle")}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 12px 16px" }}>
        <LanguageSwitcher isCompact />
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => {
          if (item.roles && !hasPermission(item.roles)) return null;

          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${item.isPos ? "pos-launch-btn" : ""} ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(item.dictKey, item.defaultLabel)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="branch-badge">
          <span className="branch-dot" />
          <div>
            <strong style={{ display: "block", color: "#fff", fontSize: 13 }}>{user?.branchName || "Main Branch"}</strong>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Role: {user?.role || "GUEST"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
