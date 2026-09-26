"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher({ isCompact = false }: { isCompact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgba(255, 255, 255, 0.08)",
        padding: 3,
        borderRadius: "var(--radius-full)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        width: "100%",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        style={{
          flex: 1,
          padding: isCompact ? "4px 8px" : "6px 12px",
          borderRadius: "var(--radius-full)",
          border: "none",
          background: language === "bn" ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" : "transparent",
          color: language === "bn" ? "#ffffff" : "#94a3b8",
          fontSize: isCompact ? 12 : 13,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          boxShadow: language === "bn" ? "0 2px 6px rgba(99, 102, 241, 0.4)" : "none",
        }}
      >
        <span>🇧🇩</span>
        <span>বাংলা</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        style={{
          flex: 1,
          padding: isCompact ? "4px 8px" : "6px 12px",
          borderRadius: "var(--radius-full)",
          border: "none",
          background: language === "en" ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" : "transparent",
          color: language === "en" ? "#ffffff" : "#94a3b8",
          fontSize: isCompact ? 12 : 13,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          boxShadow: language === "en" ? "0 2px 6px rgba(99, 102, 241, 0.4)" : "none",
        }}
      >
        <span>🇺🇸</span>
        <span>English</span>
      </button>
    </div>
  );
}
