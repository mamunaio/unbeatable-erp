"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, DictionaryKey, dictionaries } from "./dictionaries";

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  toggleLanguage: () => void;
  t: (key: DictionaryKey, fallback?: string) => string;
  isBengali: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "unbeatable_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>("bn");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "en" || stored === "bn") {
        setLanguageState(stored);
      }
    } catch {
      // Fallback
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang: Locale = language === "bn" ? "en" : "bn";
    setLanguage(nextLang);
  };

  const t = (key: DictionaryKey, fallback?: string): string => {
    const currentDict = dictionaries[language] || dictionaries.bn;
    const value = currentDict[key];
    if (value) return value;
    return fallback || key;
  };

  const isBengali = language === "bn";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isBengali }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
