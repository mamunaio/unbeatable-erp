"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  IconPrint,
  IconCheck,
} from "./Icons";

type CategoryFilter = "ALL" | "ACTIONS" | "CORE" | "SALES" | "OPERATIONS" | "FINANCE";

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: "ACTIONS" | "CORE" | "SALES" | "OPERATIONS" | "FINANCE" | "SETTINGS";
  groupName: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
}

const allRoutes: PaletteItem[] = [
  // Quick Actions Group
  {
    id: "act-1",
    title: "⚡ নতুন POS বিক্রয় কাউন্টার ওপেন করুন",
    subtitle: "কাস্টমার বিলিং, বারকোড স্ক্যান ও ক্যাশ গ্রহণ",
    href: "/pos",
    category: "ACTIONS",
    groupName: "⚡ কুইক একশন (Quick Actions)",
    icon: <IconPos size={18} color="#ffffff" />,
    accentColor: "#4f46e5",
    badge: "F8 / Sale",
  },
  {
    id: "act-2",
    title: "＋ নতুন প্রোডাক্ট ক্যাটালগে যুক্ত করুন",
    subtitle: "নতুন আইটেমের বারকোড, ক্রয়মূল্য ও বিক্রয়মূল্য এন্ট্রি",
    href: "/products/new",
    category: "ACTIONS",
    groupName: "⚡ কুইক একশন (Quick Actions)",
    icon: <IconPlus size={18} color="#ffffff" />,
    accentColor: "#059669",
    badge: "New Item",
  },
  {
    id: "act-3",
    title: "🛒 নতুন মাল্টি-আইটেম ক্রয় চালান (Purchase PO)",
    subtitle: "সাপ্লায়ার চালান এন্ট্রি ও ইনস্ট্যান্ট স্টক ইনওয়ার্ড",
    href: "/purchases/new",
    category: "ACTIONS",
    groupName: "⚡ কুইক একশন (Quick Actions)",
    icon: <IconPurchases size={18} color="#ffffff" />,
    accentColor: "#0284c7",
    badge: "Stock Inward",
  },
  {
    id: "act-4",
    title: "💬 বাল্ক এসএমএস মার্কেটিং ও অফার ব্রডকাস্ট",
    subtitle: "গ্রাহকদের অফার প্রচার ও বাকি আদায়ের তাগাদা SMS",
    href: "/marketing/sms",
    category: "ACTIONS",
    groupName: "⚡ কুইক একশন (Quick Actions)",
    icon: <IconSms size={18} color="#ffffff" />,
    accentColor: "#8b5cf6",
    badge: "SMS Blast",
  },

  // Core Overview
  {
    id: "core-1",
    title: "ড্যাশবোর্ড ও এক্সিকিউটিভ ওভারভিউ",
    subtitle: "ব্যবসার লাইভ কেপিআই, মোট সেলস ও গ্রস প্রফিট মার্জিন",
    href: "/dashboard",
    category: "CORE",
    groupName: "📊 কোর ড্যাশবোর্ড ও রিপোর্টস",
    icon: <IconDashboard size={18} color="#ffffff" />,
    accentColor: "#4f46e5",
  },
  {
    id: "core-2",
    title: "বিক্রয় ও ইনভয়েস হিস্ট্রি (Sales Invoices)",
    subtitle: "সকল ক্যাশ ও বাকি রসিদ, A4 মূসক-৬.৩ / থার্মাল স্লিপ প্রিন্ট",
    href: "/sales",
    category: "SALES",
    groupName: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    icon: <IconSales size={18} color="#ffffff" />,
    accentColor: "#0284c7",
  },
  {
    id: "core-3",
    title: "কাস্টমার বাকি খাতা ও CRM লেজার",
    subtitle: "গ্রাহক প্রোফাইল, বাকি আদায় ও ইন্ডিভিজুয়াল খতিয়ান",
    href: "/customers",
    category: "SALES",
    groupName: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    icon: <IconCustomers size={18} color="#ffffff" />,
    accentColor: "#0284c7",
  },
  {
    id: "core-4",
    title: "কুরিয়ার ও পার্সেল ডেলিভারি হাব (Logistics)",
    subtitle: "Steadfast, Pathao ও RedX লাইভ পার্সেল ট্র্যাকিং",
    href: "/logistics",
    category: "SALES",
    groupName: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    icon: <IconLogistics size={18} color="#ffffff" />,
    accentColor: "#d97706",
  },
  {
    id: "core-5",
    title: "কুপন কোড ও স্পেশাল অফার (Promotions)",
    subtitle: "ডিসকাউন্ট কুপন, BOGO অফার ও লয়্যালটি রুলস",
    href: "/promotions",
    category: "SALES",
    groupName: "🧾 সেলস, কাস্টমার ও লজিস্টিকস",
    icon: <IconPromotions size={18} color="#ffffff" />,
    accentColor: "#e11d48",
  },

  // Operations & Inventory
  {
    id: "ops-1",
    title: "প্রোডাক্ট ক্যাটালগ ও প্রাইজ লিস্ট (Products)",
    subtitle: "পণ্য তালিকা, বারকোড স্টিকার প্রিন্ট ও স্পেশাল অ্যাড-অন",
    href: "/products",
    category: "OPERATIONS",
    groupName: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    icon: <IconProducts size={18} color="#ffffff" />,
    accentColor: "#059669",
  },
  {
    id: "ops-2",
    title: "ইনভেন্টরি লেজার ও স্টক ট্র্যাকিং",
    subtitle: "ডাবল-এন্ট্রি স্টক মুভমেন্ট, ব্রাঞ্চ ট্রান্সফার ও অডিট",
    href: "/inventory",
    category: "OPERATIONS",
    groupName: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    icon: <IconInventory size={18} color="#ffffff" />,
    accentColor: "#059669",
  },
  {
    id: "ops-3",
    title: "ড্যামেজ ও অপচয় রেজিস্টার (Damages)",
    subtitle: "মেয়াদোত্তীর্ণ ও নষ্ট পণ্য রাইট-অফ ও লস হিসাব",
    href: "/inventory/damages",
    category: "OPERATIONS",
    groupName: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    icon: <IconInventory size={18} color="#ffffff" />,
    accentColor: "#f43f5e",
  },
  {
    id: "ops-4",
    title: "সাপ্লায়ার ডিরেক্টরি ও খতিয়ান (Suppliers)",
    subtitle: "মহাজনদের প্রদেয় বকেয়া ও পারচেজ হিস্ট্রি লেজার",
    href: "/suppliers",
    category: "OPERATIONS",
    groupName: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    icon: <IconSuppliers size={18} color="#ffffff" />,
    accentColor: "#059669",
  },
  {
    id: "ops-5",
    title: "এইচআর, স্টাফ হাজিরা ও কমিশন (HR)",
    subtitle: "কর্মচারী বায়োমেট্রিক উপস্থিতি ও মাসিক পে-রোল",
    href: "/hr",
    category: "OPERATIONS",
    groupName: "📦 ইনভেন্টরি, ওয়্যারহাউজ ও সাপ্লায়ার",
    icon: <IconHr size={18} color="#ffffff" />,
    accentColor: "#d97706",
  },

  // Finance & VAT Tax
  {
    id: "fin-1",
    title: "এনবিআর ভ্যাট রিটার্ন (Mushak-9.1)",
    subtitle: "সরকারি মূসক রিটার্ন চার্ট, ইনপুট ট্যাক্স রেয়াত ও VDS",
    href: "/reports/vat",
    category: "FINANCE",
    groupName: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    icon: <IconReports size={18} color="#ffffff" />,
    accentColor: "#4f46e5",
  },
  {
    id: "fin-2",
    title: "ব্যালেন্স শিট ও আর্থিক বিবরণী (Balance Sheet)",
    subtitle: "দোকানের মোট সম্পদ, দায় ও ওনার্স ইকুইটি শিট",
    href: "/reports/balance-sheet",
    category: "FINANCE",
    groupName: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    icon: <IconReports size={18} color="#ffffff" />,
    accentColor: "#4f46e5",
  },
  {
    id: "fin-3",
    title: "ব্যাংক ও এমএফএস অ্যাকাউন্টস লেজার",
    subtitle: "ব্যাংক হিসাব, বিকাশ, নগদ ও ক্যাশ ড্রয়ার খাতা",
    href: "/accounting/bank-accounts",
    category: "FINANCE",
    groupName: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    icon: <IconBankAccounts size={18} color="#ffffff" />,
    accentColor: "#4f46e5",
  },
  {
    id: "fin-4",
    title: "দৈনন্দিন খরচ ও পেট্টি ক্যাশ (Expenses)",
    subtitle: "দোকানের খরচ, ভাউচার ও ক্যাশবুক হিসাব",
    href: "/expenses",
    category: "FINANCE",
    groupName: "💰 ফাইন্যান্স, ব্যাংকিং ও এনবিআর ট্যাক্স",
    icon: <IconExpenses size={18} color="#ffffff" />,
    accentColor: "#f43f5e",
  },
  {
    id: "fin-5",
    title: "সিস্টেম সেটিংস ও পারমিশন (Settings)",
    subtitle: "দোকানের প্রোফাইল, প্রিন্টার রুলস, ব্রাঞ্চ ও ব্যাকআপ",
    href: "/settings",
    category: "SETTINGS",
    groupName: "⚙️ সিস্টেম কনফিগারেশন",
    icon: <IconSettings size={18} color="#ffffff" />,
    accentColor: "#64748b",
  },
];

export function CommandPaletteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setQuery("");
      setActiveCategory("ALL");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = allRoutes.filter((item) => {
    const q = query.toLowerCase();
    const matchCategory = activeCategory === "ALL" || item.category === activeCategory;
    const matchText =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q) ||
      item.groupName.toLowerCase().includes(q);
    return matchCategory && matchText;
  });

  // Handle Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      router.push(filteredItems[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
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
        background: "rgba(11, 15, 25, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
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
          background: "#111827",
          width: "100%",
          maxWidth: 680,
          borderRadius: 24,
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
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
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 100%)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 2px 10px rgba(99, 102, 241, 0.4)",
              flexShrink: 0,
            }}
          >
            <IconSearch size={17} color="#ffffff" />
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
            placeholder="যেকোনো পেজ, ফিচার বা মেনুতে দ্রুত জাম্প করুন... (e.g. POS, VAT, Stock)"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              outline: "none",
              boxShadow: "none",
            }}
          />

          <kbd
            style={{
              padding: "4px 8px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
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
            padding: "10px 20px",
            background: "#0b0f19",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            overflowX: "auto",
          }}
        >
          {[
            { id: "ALL", label: "🌐 সকল পেজ" },
            { id: "ACTIONS", label: "⚡ কুইক একশন" },
            { id: "SALES", label: "🧾 সেলস ও CRM" },
            { id: "OPERATIONS", label: "📦 স্টক ও ক্রয়" },
            { id: "FINANCE", label: "💰 একাউন্টস ও ভ্যাট" },
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
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: activeCategory === tab.id ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" : "rgba(255, 255, 255, 0.05)",
                color: activeCategory === tab.id ? "#ffffff" : "#94a3b8",
                boxShadow: activeCategory === tab.id ? "0 2px 8px rgba(99, 102, 241, 0.35)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 390, overflowY: "auto", padding: "10px 14px" }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: "48px 16px", textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8" }}>কোনো পেজ বা মডিউল পাওয়া যায়নি</p>
              <span style={{ fontSize: 12.5 }}>বানান পরীক্ষা করুন বা ভিন্ন কিওয়ার্ড লিখে সার্চ করুন</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
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
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: isSelected ? "rgba(99, 102, 241, 0.18)" : "transparent",
                    border: isSelected ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid transparent",
                    transition: "all var(--transition-fast)",
                    marginBottom: 3,
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: isSelected ? item.accentColor : "rgba(255, 255, 255, 0.06)",
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
                            color: isSelected ? "#ffffff" : "#e2e8f0",
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {item.title}
                        </strong>
                        {item.badge && (
                          <span
                            className="badge"
                            style={{
                              fontSize: 10,
                              padding: "2px 6px",
                              background: "rgba(99, 102, 241, 0.25)",
                              color: "#a5b4fc",
                              border: "1px solid rgba(99, 102, 241, 0.4)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: "#94a3b8", display: "block", marginTop: 2 }}>
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isSelected ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: 6,
                          boxShadow: "0 2px 6px rgba(99, 102, 241, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        Jump ↵
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Sleek Raycast Footer */}
        <div
          style={{
            padding: "12px 20px",
            background: "#0b0f19",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#fff", fontSize: 10 }}>↑</kbd>
              <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#fff", fontSize: 10 }}>↓</kbd>
              নেভিগেশন
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4, color: "#fff", fontSize: 10 }}>↵ Enter</kbd>
              ওপেন
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: "#818cf8", fontWeight: 700 }}>
            {filteredItems[selectedIndex] ? filteredItems[selectedIndex].title.slice(0, 30) + "..." : "Unbeatable ERP"}
          </div>
        </div>
      </div>
    </div>
  );
}
