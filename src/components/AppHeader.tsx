
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import SpeechToggle from "./SpeechToggle";
import LanguageToggle from "./LanguageToggle";
import { LogOut, User } from "lucide-react";

const AppHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/placeholder.svg" alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-primary">ASHASEVA</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {currentUser && (
            <>
              <SpeechToggle 
                text={`Welcome ${currentUser.name}. Click this button to hear the content.`} 
                teluguText={`స్వాగతం ${currentUser.name}. విషయాన్ని వినడానికి ఈ బటన్ క్లిక్ చేయండి.`}
              />
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm font-medium">{currentUser.name}</span>
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <button 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-red-500 flex items-center gap-1"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline text-sm">{t("Logout", "లాగ్ అవుట్")}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
