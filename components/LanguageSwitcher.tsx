"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher({ isCompact = false }: { isCompact?: boolean }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher-btn"
      title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: isCompact ? "4px 8px" : "6px 12px",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.12)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
        fontSize: isCompact ? 12 : 13,
        fontWeight: 700,
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        transition: "all 0.15s ease",
      }}
    >
      <span>{language === "bn" ? "🇧🇩" : "🇺🇸"}</span>
      <span>{language === "bn" ? "বাংলা" : "English"}</span>
      <span style={{ opacity: 0.6, fontSize: 10 }}>⇄</span>
    </button>
  );
}
