
import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "english" | "telugu";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (english: string, telugu: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("english");

  const t = (english: string, telugu: string): string => {
    return language === "english" ? english : telugu;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
