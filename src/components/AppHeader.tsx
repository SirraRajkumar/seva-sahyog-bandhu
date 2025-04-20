
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import SpeechToggle from "./SpeechToggle";
import LanguageToggle from "./LanguageToggle";
import { LogOut, User, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AppHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate(currentUser?.role === "admin" ? "/admin-dashboard" : "/patient-dashboard")}
        >
          <img src="/ashaseva-logo.svg" alt="ASHASEVA Logo" className="h-10 w-10" />
          <h1 className="text-xl md:text-2xl font-bold text-primary">ASHASEVA</h1>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            {currentUser && (
              <SpeechToggle 
                text={`Welcome ${currentUser.name}. Click this button to hear the content.`} 
                teluguText={`స్వాగతం ${currentUser.name}. విషయాన్ని వినడానికి ఈ బటన్ క్లిక్ చేయండి.`}
              />
            )}
            <button 
              className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {menuOpen && (
              <div className="absolute top-full right-4 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="p-2 border-b">
                  <LanguageToggle />
                </div>
                {currentUser && (
                  <>
                    <div className="p-3 flex items-center gap-2 border-b">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full p-3 text-left text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t("Logout", "లాగ్ అవుట్")}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {currentUser && (
              <>
                <SpeechToggle 
                  text={`Welcome ${currentUser.name}. Click this button to hear the content.`} 
                  teluguText={`స్వాగతం ${currentUser.name}. విషయాన్ని వినడానికి ఈ బటన్ క్లిక్ చేయండి.`}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-600 hover:text-red-500 flex items-center gap-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">{t("Logout", "లాగ్ అవుట్")}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
