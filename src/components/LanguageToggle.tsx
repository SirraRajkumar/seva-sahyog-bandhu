
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "telugu" : "english");
  };

  return (
    <Button 
      variant="outline" 
      className="rounded-full text-sm px-3 py-1" 
      onClick={toggleLanguage}
    >
      {t("ಇಂಗ್ಲಿಷ್/తెలుగు", "English/తెలుగు")}
    </Button>
  );
};

export default LanguageToggle;
