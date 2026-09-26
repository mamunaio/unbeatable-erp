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
} from "./Icons";

interface PaletteItem {
  title: string;
  subtitle: string;
  href: string;
  category: "CORE" | "SALES" | "FINANCE" | "OPERATIONS" | "SETTINGS";
  icon: React.ReactNode;
}

const allRoutes: PaletteItem[] = [
  { title: "পিওএস কাউন্টার (POS Terminal)", subtitle: "আল্ট্রাফাস্ট চেকআউট ও বিলিং", href: "/pos", category: "CORE", icon: <IconPos size={18} color="#4f46e5" /> },
  { title: "ড্যাশবোর্ড (Dashboard)", subtitle: "ব্যবসার লাইভ কেপিআই ও ওভারভিউ", href: "/dashboard", category: "CORE", icon: <IconDashboard size={18} color="#4f46e5" /> },
  { title: "প্রোডাক্ট ক্যাটালগ (Products)", subtitle: "পণ্য তালিকা, বারকোড ও মূল্য", href: "/products", category: "OPERATIONS", icon: <IconProducts size={18} color="#059669" /> },
  { title: "ইনভেন্টরি লেজার ও স্টক (Inventory)", subtitle: "স্টক মুভমেন্ট ও ট্রান্সফার", href: "/inventory", category: "OPERATIONS", icon: <IconInventory size={18} color="#059669" /> },
  { title: "ড্যামেজ ও অপচয় রেজিস্টার (Damages)", subtitle: "মেয়াদোত্তীর্ণ ও নষ্ট পণ্য রাইট-অফ", href: "/inventory/damages", category: "OPERATIONS", icon: <IconInventory size={18} color="#f43f5e" /> },
  { title: "বিক্রয় ও ইনভয়েস (Sales)", subtitle: "ইনভয়েস হিস্ট্রি ও প্রিন্ট ভাউচার", href: "/sales", category: "SALES", icon: <IconSales size={18} color="#0284c7" /> },
  { title: "কুপন ও প্রমোশন (Promotions)", subtitle: "ডিসকাউন্ট কুপন ও অফার", href: "/promotions", category: "SALES", icon: <IconPromotions size={18} color="#0284c7" /> },
  { title: "এসএমএস মার্কেটিং (SMS Marketing)", subtitle: "বাল্ক প্রচার ও বাকি আদায়ের নোটিশ", href: "/marketing/sms", category: "SALES", icon: <IconSms size={18} color="#0284c7" /> },
  { title: "কুরিয়ার ও ডেলিভারি (Logistics)", subtitle: "Steadfast ও Pathao পার্সেল ট্র্যাকিং", href: "/logistics", category: "SALES", icon: <IconLogistics size={18} color="#d97706" /> },
  { title: "পণ্য ক্রয় ও চালান (Purchases)", subtitle: "মাল্টি-আইটেম সাপ্লায়ার ক্রয় বিল্ডার", href: "/purchases/new", category: "OPERATIONS", icon: <IconPurchases size={18} color="#059669" /> },
  { title: "কাস্টমার বাকি খাতা (Customers CRM)", subtitle: "গ্রাহক প্রোফাইল ও লেজার স্টেটমেন্ট", href: "/customers", category: "SALES", icon: <IconCustomers size={18} color="#0284c7" /> },
  { title: "সাপ্লায়ার ডিরেক্টরি (Suppliers)", subtitle: "মহাজনদের পাওনা ও লেজার", href: "/suppliers", category: "OPERATIONS", icon: <IconSuppliers size={18} color="#059669" /> },
  { title: "দৈনন্দিন খরচ (Expenses)", subtitle: "দোকানের ক্যাশ আউট ও পেট্টি ক্যাশ", href: "/expenses", category: "FINANCE", icon: <IconExpenses size={18} color="#f43f5e" /> },
  { title: "ব্যাংক ও এমএফএস অ্যাকাউন্টস", subtitle: "ব্যাংক, বিকাশ ও নগদ ক্যাশবুক", href: "/accounting/bank-accounts", category: "FINANCE", icon: <IconBankAccounts size={18} color="#4f46e5" /> },
  { title: "এনবিআর ভ্যাট রিটার্ন (Mushak-9.1)", subtitle: "সরকারি ভ্যাট ও ট্যাক্স হিসাব", href: "/reports/vat", category: "FINANCE", icon: <IconReports size={18} color="#4f46e5" /> },
  { title: "ব্যালেন্স শিট (Balance Sheet)", subtitle: "সম্পদ, দায় ও মূলধন বিবরণী", href: "/reports/balance-sheet", category: "FINANCE", icon: <IconReports size={18} color="#4f46e5" /> },
  { title: "এইচআর ও কর্মচারী হাজিরা (HR)", subtitle: "স্টাফ উপস্থিতি ও সেলস কমিশন", href: "/hr", category: "OPERATIONS", icon: <IconHr size={18} color="#d97706" /> },
  { title: "সিস্টেম সেটিংস ও পারমিশন (Settings)", subtitle: "দোকান প্রোফাইল, ভ্যাট ও ব্রাঞ্চ", href: "/settings", category: "SETTINGS", icon: <IconSettings size={18} color="#64748b" /> },
];

export function CommandPaletteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = allRoutes.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q)
    );
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
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          background: "#ffffff",
          width: "100%",
          maxWidth: 620,
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Search Header Bar */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid var(--border-color)",
            background: "#f8fafc",
          }}
        >
          <IconSearch size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="যেকোনো পেজ, ফিচার বা মেনুতে দ্রুত জাম্প করুন..."
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-main)",
            }}
          />
          <kbd
            style={{
              padding: "3px 8px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-muted)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "10px 12px" }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: "36px 16px", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>কোনো পেজ বা মডিউল খুঁজে পাওয়া যায়নি</p>
              <span style={{ fontSize: 12 }}>বানান পরীক্ষা করুন বা ভিন্ন কিওয়ার্ড লিখে সার্চ করুন</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: isSelected ? "var(--primary-light)" : "transparent",
                    transition: "all var(--transition-fast)",
                    marginBottom: 2,
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-sm)",
                        background: isSelected ? "#ffffff" : "var(--bg-subtle)",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: isSelected ? "var(--shadow-xs)" : "none",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <strong style={{ fontSize: 14, color: isSelected ? "var(--primary-dark)" : "var(--text-main)", display: "block" }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.subtitle}</span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      fontSize: 10,
                      background: isSelected ? "#ffffff" : "var(--bg-subtle)",
                      color: isSelected ? "var(--primary-dark)" : "var(--text-muted)",
                    }}
                  >
                    {item.category}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div
          style={{
            padding: "10px 18px",
            background: "#f8fafc",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11.5,
            color: "var(--text-muted)",
          }}
        >
          <span>নেভিগেট করতে <strong>↑</strong> <strong>↓</strong> চাপুন</span>
          <span>ওপেন করতে <strong>Enter ↵</strong> চাপুন</span>
        </div>
      </div>
    </div>
  );
}
