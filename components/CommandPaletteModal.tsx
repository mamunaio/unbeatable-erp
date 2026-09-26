"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  IconSearch,
  IconDashboard,
  IconPos,
  IconProducts,
  IconInventory,
  IconSales,
  IconPromotions,
  IconSms,
  IconLogistics,
  IconPurchases,
  IconCustomers,
  IconSuppliers,
  IconExpenses,
  IconBankAccounts,
  IconHr,
  IconReports,
  IconSettings,
  IconPlus,
} from "./Icons";

type CategoryFilter = "ALL" | "ACTIONS" | "CORE" | "SALES" | "OPERATIONS" | "FINANCE";

interface PaletteItem {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  href: string;
  category: "ACTIONS" | "CORE" | "SALES" | "OPERATIONS" | "FINANCE" | "SETTINGS";
  groupNameBn: string;
  groupNameEn: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
}

const allRoutes: PaletteItem[] = [
  // Quick Actions Group
  {
    id: "act-1",
    titleBn: "⚡ নতুন POS বিক্রয় কাউন্টার ওপেন করুন",
    titleEn: "⚡ Open POS Sales Counter",
    subtitleBn: "কাস্টমার বিলিং, বারকোড স্ক্যান ও ক্যাশ গ্রহণ",
    subtitleEn: "Fast customer billing, barcode scan & payment",
    href: "/pos",
    category: "ACTIONS",
    groupNameBn: "⚡ কুইক একশন (Quick Actions)",
    groupNameEn: "⚡ Quick Actions",
    icon: <IconPos size={18} color="#ffffff" />,
    accentColor: "#6366f1",
    badge: "F8 / Sale",
  },
  {
    id: "act-2",
    titleBn: "＋ নতুন প্রোডাক্ট ক্যাটালগে যুক্ত করুন",
    titleEn: "＋ Add New Product to Catalog",
    subtitleBn: "নতুন আইটেমের বারকোড, ক্রয়মূল্য ও বিক্রয়মূল্য এন্ট্রি",
    subtitleEn: "Add item barcode, cost, and selling price",
    href: "/products/new",
    category: "ACTIONS",
    groupNameBn: "⚡ কুইক একশন (Quick Actions)",
    groupNameEn: "⚡ Quick Actions",
    icon: <IconPlus size={18} color="#ffffff" />,
    accentColor: "#8b5cf6",
    badge: "New Item",
  },
  {
    id: "act-3",
    titleBn: "🛒 নতুন মাল্টি-আইটেম ক্রয় চালান (Purchase PO)",
    titleEn: "🛒 New Purchase Order (PO Inward)",
    subtitleBn: "সাপ্লায়ার চালান এন্ট্রি ও ইনস্ট্যান্ট স্টক ইনওয়ার্ড",
    subtitleEn: "Supplier PO invoice & instant stock inward",
    href: "/purchases/new",
    category: "ACTIONS",
    groupNameBn: "⚡ কুইক একশন (Quick Actions)",
    groupNameEn: "⚡ Quick Actions",
    icon: <IconPurchases size={18} color="#ffffff" />,
    accentColor: "#38bdf8",
    badge: "Stock Inward",
  },
  {
    id: "act-4",
    titleBn: "💬 বাল্ক এসএমএস মার্কেটিং ও অফার ব্রডকাস্ট",
    titleEn: "💬 Bulk SMS Marketing & Broadcast",
    subtitleBn: "গ্রাহকদের অফার প্রচার ও বাকি আদায়ের তাগাদা SMS",
    subtitleEn: "Customer offers and due payment reminder SMS",
    href: "/marketing/sms",
    category: "ACTIONS",
    groupNameBn: "⚡ কুইক একশন (Quick Actions)",
    groupNameEn: "⚡ Quick Actions",
    icon: <IconSms size={18} color="#ffffff" />,
    accentColor: "#f59e0b",
    badge: "SMS Blast",
  },

  // Core Overview
  {
    id: "core-1",
    titleBn: "ড্যাশবোর্ড ও এক্সিকিউটিভ ওভারভিউ",
    titleEn: "Dashboard & Executive Overview",
    subtitleBn: "ব্যবসার লাইভ কেপিআই, মোট সেলস ও গ্রস প্রফিট মার্জিন",
    subtitleEn: "Live business KPI, gross profit margin & sales",
    href: "/dashboard",
    category: "CORE",
    groupNameBn: "📊 কোর ড্যাশবোর্ড ও রিপোর্টস",
    groupNameEn: "📊 Core Dashboard & Reports",
    icon: <IconDashboard size={18} color="#ffffff" />,
    accentColor: "#6366f1",
  },
  {
    id: "core-2",
    titleBn: "বিক্রয় ও ইনভয়েস হিস্ট্রি (Sales Invoices)",
    titleEn: "Sales & Invoices History",
    subtitleBn: "সকল ক্যাশ ও বাকি রসিদ, A4 মূসক-৬.৩ / থার্মাল স্লিপ প্রিন্ট",
    subtitleEn: "Cash & credit invoices, thermal receipt & VAT slip",
    href: "/sales",
    category: "SALES",
    groupNameBn: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    groupNameEn: "🧾 Sales, Customers & Logistics",
    icon: <IconSales size={18} color="#ffffff" />,
    accentColor: "#10b981",
  },
  {
    id: "core-3",
    titleBn: "কাস্টমার বাকি খাতা ও CRM লেজার",
    titleEn: "Customer Due Ledger & CRM",
    subtitleBn: "গ্রাহক প্রোফাইল, বাকি আদায় ও ইন্ডিভিজুয়াল খতিয়ান",
    subtitleEn: "Customer profiles, balance due & credit ledger",
    href: "/customers",
    category: "SALES",
    groupNameBn: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    groupNameEn: "🧾 Sales, Customers & Logistics",
    icon: <IconCustomers size={18} color="#ffffff" />,
    accentColor: "#f43f5e",
  },
  {
    id: "core-4",
    titleBn: "কুরিয়ার ও পার্সেল ডেলিভারি হাব (Logistics)",
    titleEn: "Courier & Parcel Delivery Hub",
    subtitleBn: "Steadfast, Pathao ও RedX লাইভ পার্সেল ট্র্যাকিং",
    subtitleEn: "Live parcel tracking with Steadfast, Pathao & RedX",
    href: "/logistics",
    category: "SALES",
    groupNameBn: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    groupNameEn: "🧾 Sales, Customers & Logistics",
    icon: <IconLogistics size={18} color="#ffffff" />,
    accentColor: "#0ea5e9",
  },
  {
    id: "core-5",
    titleBn: "কুপন কোড ও স্পেশাল অফার (Promotions)",
    titleEn: "Coupons & Special Promotions",
    subtitleBn: "ডিসকাউন্ট কুপন, BOGO অফার ও লয়্যালটি রুলস",
    subtitleEn: "Discount coupons, BOGO deals & loyalty rewards",
    href: "/promotions",
    category: "SALES",
    groupNameBn: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    groupNameEn: "🧾 Sales, Customers & Logistics",
    icon: <IconPromotions size={18} color="#ffffff" />,
    accentColor: "#a855f7",
  },

  // Operations & Inventory
  {
    id: "ops-1",
    titleBn: "প্রোডাক্ট ক্যাটালগ ও প্রাইজ লিস্ট (Products)",
    titleEn: "Product Catalog & Price List",
    subtitleBn: "পণ্য তালিকা, বারকোড স্টিকার প্রিন্ট ও স্পেশাল অ্যাড-অন",
    subtitleEn: "Item catalog, barcode stickers & special add-ons",
    href: "/products",
    category: "OPERATIONS",
    groupNameBn: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    groupNameEn: "📦 Inventory, Warehouse & Vendors",
    icon: <IconProducts size={18} color="#ffffff" />,
    accentColor: "#6366f1",
  },
  {
    id: "ops-2",
    titleBn: "ইনভেন্টরি লেজার ও স্টক ট্র্যাকিং",
    titleEn: "Inventory Ledger & Stock Audit",
    subtitleBn: "ডাবল-এন্ট্রি স্টক মুভমেন্ট, ব্রাঞ্চ ট্রান্সফার ও অডিট",
    subtitleEn: "Double-entry stock movement & branch transfers",
    href: "/inventory",
    category: "OPERATIONS",
    groupNameBn: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    groupNameEn: "📦 Inventory, Warehouse & Vendors",
    icon: <IconInventory size={18} color="#ffffff" />,
    accentColor: "#10b981",
  },
  {
    id: "ops-3",
    titleBn: "ড্যামেজ ও অপচয় রেজিস্টার (Damages)",
    titleEn: "Damage & Wastage Register",
    subtitleBn: "মেয়াদোত্তীর্ণ ও নষ্ট পণ্য রাইট-অফ ও লস হিসাব",
    subtitleEn: "Expired & damaged item write-offs and loss audit",
    href: "/inventory/damages",
    category: "OPERATIONS",
    groupNameBn: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    groupNameEn: "📦 Inventory, Warehouse & Vendors",
    icon: <IconInventory size={18} color="#ffffff" />,
    accentColor: "#f43f5e",
  },
  {
    id: "ops-4",
    titleBn: "সাপ্লায়ার ডিরেক্টরি ও খতিয়ান (Suppliers)",
    titleEn: "Supplier Directory & Ledger",
    subtitleBn: "মহাজনদের প্রদেয় বকেয়া ও পারচেজ হিস্ট্রি লেজার",
    subtitleEn: "Vendor payable dues & purchase histories",
    href: "/suppliers",
    category: "OPERATIONS",
    groupNameBn: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    groupNameEn: "📦 Inventory, Warehouse & Vendors",
    icon: <IconSuppliers size={18} color="#ffffff" />,
    accentColor: "#8b5cf6",
  },
  {
    id: "ops-5",
    titleBn: "এইচআর, স্টাফ হাজিরা ও কমিশন (HR)",
    titleEn: "HR, Staff Attendance & Commission",
    subtitleBn: "কর্মচারী বায়োমেট্রিক উপস্থিতি ও মাসিক পে-রোল",
    subtitleEn: "Staff attendance, biometric logs & monthly payroll",
    href: "/hr",
    category: "OPERATIONS",
    groupNameBn: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    groupNameEn: "📦 Inventory, Warehouse & Vendors",
    icon: <IconHr size={18} color="#ffffff" />,
    accentColor: "#0ea5e9",
  },

  // Finance & VAT Tax
  {
    id: "fin-1",
    titleBn: "এনবিআর ভ্যাট রিটার্ন (Mushak-9.1)",
    titleEn: "NBR VAT Return (Mushak-9.1)",
    subtitleBn: "সরকারি মূসক রিটার্ন চার্ট, ইনপুট ট্যাক্স রেয়াত ও VDS",
    subtitleEn: "Official VAT returns, input tax rebate & VDS reports",
    href: "/reports/vat",
    category: "FINANCE",
    groupNameBn: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    groupNameEn: "💰 Finance, Banking & NBR Tax",
    icon: <IconReports size={18} color="#ffffff" />,
    accentColor: "#6366f1",
  },
  {
    id: "fin-2",
    titleBn: "ব্যালেন্স শিট ও আর্থিক বিবরণী (Balance Sheet)",
    titleEn: "Balance Sheet & Financial Statements",
    subtitleBn: "দোকানের মোট সম্পদ, দায় ও ওনার্স ইকুইটি শিট",
    subtitleEn: "Store total assets, liabilities & equity reports",
    href: "/reports/balance-sheet",
    category: "FINANCE",
    groupNameBn: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    groupNameEn: "💰 Finance, Banking & NBR Tax",
    icon: <IconReports size={18} color="#ffffff" />,
    accentColor: "#10b981",
  },
  {
    id: "fin-3",
    titleBn: "ব্যাংক ও এমএফএস অ্যাকাউন্টস লেজার",
    titleEn: "Bank & MFS Accounts Ledger",
    subtitleBn: "ব্যাংক হিসাব, বিকাশ, নগদ ও ক্যাশ ড্রয়ার খাতা",
    subtitleEn: "Bank accounts, bKash, Nagad & cash drawer balances",
    href: "/accounting/bank-accounts",
    category: "FINANCE",
    groupNameBn: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    groupNameEn: "💰 Finance, Banking & NBR Tax",
    icon: <IconBankAccounts size={18} color="#ffffff" />,
    accentColor: "#38bdf8",
  },
  {
    id: "fin-4",
    titleBn: "দৈনন্দিন খরচ ও পেট্টি ক্যাশ (Expenses)",
    titleEn: "Daily Expenses & Petty Cash",
    subtitleBn: "দোকানের খরচ, ভাউচার ও ক্যাশবুক হিসাব",
    subtitleEn: "Store expenses, vouchers and cashbook register",
    href: "/expenses",
    category: "FINANCE",
    groupNameBn: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    groupNameEn: "💰 Finance, Banking & NBR Tax",
    icon: <IconExpenses size={18} color="#ffffff" />,
    accentColor: "#f43f5e",
  },
  {
    id: "fin-5",
    titleBn: "সিস্টেম সেটিংস ও পারমিশন (Settings)",
    titleEn: "System Settings & Permissions",
    subtitleBn: "দোকানের প্রোফাইল, প্রিন্টার রুলস, ব্রাঞ্চ ও ব্যাকআপ",
    subtitleEn: "Store profile, POS printer, branches & backup",
    href: "/settings",
    category: "SETTINGS",
    groupNameBn: "⚙️ সিস্টেম কনফিগারেশন",
    groupNameEn: "⚙️ System Configuration",
    icon: <IconSettings size={18} color="#ffffff" />,
    accentColor: "#94a3b8",
  },
];

export function CommandPaletteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isBengali } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setActiveCategory("ALL");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filtering
  const filteredItems = allRoutes.filter((item) => {
    const matchesCategory =
      activeCategory === "ALL" ||
      (activeCategory === "ACTIONS" && item.category === "ACTIONS") ||
      (activeCategory === "CORE" && item.category === "CORE") ||
      (activeCategory === "SALES" && item.category === "SALES") ||
      (activeCategory === "OPERATIONS" && item.category === "OPERATIONS") ||
      (activeCategory === "FINANCE" && (item.category === "FINANCE" || item.category === "SETTINGS"));

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      item.titleBn.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.subtitleBn.toLowerCase().includes(q) ||
      item.subtitleEn.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q) ||
      item.groupNameBn.toLowerCase().includes(q) ||
      item.groupNameEn.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        router.push(filteredItems[selectedIndex].href);
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "grid",
        placeItems: "center",
        zIndex: 250,
        padding: 16,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f172a",
          width: "100%",
          maxWidth: 680,
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
          color: "#f8fafc",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Seamless Search Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--radius-sm)",
              background: "var(--aurora-gradient)",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--aurora-glow)",
              flexShrink: 0,
            }}
          >
            <IconSearch size={18} color="#ffffff" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isBengali
                ? "যেকোনো পেজ, ফিচার বা মেনুতে দ্রুত জাম্প করুন... (e.g. POS, VAT, Stock)"
                : "Jump to any page, feature or action... (e.g. POS, VAT, Stock)"
            }
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: 15.5,
              fontWeight: 500,
              color: "#ffffff",
              outline: "none",
              boxShadow: "none",
            }}
          />

          <kbd
            style={{
              padding: "3px 7px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 0.5,
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Filter Chips Bar */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "10px 16px",
            background: "#090d16",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            overflowX: "auto",
          }}
        >
          {[
            { id: "ALL", label: isBengali ? "🌐 সকল পেজ" : "🌐 All Pages" },
            { id: "ACTIONS", label: isBengali ? "⚡ কুইক একশন" : "⚡ Quick Actions" },
            { id: "SALES", label: isBengali ? "🧾 সেলস ও CRM" : "🧾 Sales & CRM" },
            { id: "OPERATIONS", label: isBengali ? "📦 স্টক ও ক্রয়" : "📦 Inventory & Purchases" },
            { id: "FINANCE", label: isBengali ? "💰 একাউন্টস ও ভ্যাট" : "💰 Accounts & VAT" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCategory(tab.id as any);
                setSelectedIndex(0);
              }}
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                border: "none",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: activeCategory === tab.id ? "var(--aurora-gradient)" : "rgba(255, 255, 255, 0.05)",
                color: activeCategory === tab.id ? "#ffffff" : "#94a3b8",
                boxShadow: activeCategory === tab.id ? "var(--aurora-glow)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 390, overflowY: "auto", padding: "8px 12px", background: "#0c121e" }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>
                {isBengali ? "কোনো পেজ বা মডিউল পাওয়া যায়নি" : "No matching pages found"}
              </p>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>
                {isBengali ? "বানান পরীক্ষা করুন বা ভিন্ন কিওয়ার্ড লিখে সার্চ করুন" : "Check spelling or search with different keywords"}
              </span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const title = isBengali ? item.titleBn : item.titleEn;
              const subtitle = isBengali ? item.subtitleBn : item.subtitleEn;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-md)",
                    background: isSelected ? "rgba(99, 102, 241, 0.15)" : "transparent",
                    border: isSelected ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid transparent",
                    transition: "all var(--transition-fast)",
                    marginBottom: 2,
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: isSelected ? item.accentColor : "rgba(255, 255, 255, 0.05)",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: isSelected ? `0 4px 12px ${item.accentColor}55` : "none",
                        transition: "all 0.15s ease",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong
                          style={{
                            fontSize: 13.5,
                            color: isSelected ? "#ffffff" : "#f1f5f9",
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {title}
                        </strong>
                        {item.badge && (
                          <span
                            className="badge"
                            style={{
                              fontSize: 10,
                              padding: "2px 6px",
                              background: "rgba(99, 102, 241, 0.15)",
                              color: "#c7d2fe",
                              border: "1px solid rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: "#94a3b8", display: "block", marginTop: 2 }}>
                        {subtitle}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isSelected ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 2px 6px rgba(99, 102, 241, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        Jump ↵
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Sleek Footer */}
        <div
          style={{
            padding: "10px 18px",
            background: "#080c14",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, color: "#94a3b8", fontSize: 10 }}>↑</kbd>
              <kbd style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, color: "#94a3b8", fontSize: 10 }}>↓</kbd>
              {isBengali ? "নেভিগেশন" : "Navigate"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4, color: "#94a3b8", fontSize: 10 }}>↵ Enter</kbd>
              {isBengali ? "ওপেন" : "Open"}
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: "#818cf8", fontWeight: 600 }}>
            {filteredItems[selectedIndex]
              ? (isBengali ? filteredItems[selectedIndex].titleBn : filteredItems[selectedIndex].titleEn).slice(0, 34) + "..."
              : "Unbeatable Modern ERP"}
          </div>
        </div>
      </div>
    </div>
  );
}
