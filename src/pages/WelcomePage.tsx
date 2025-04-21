
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import LanguageToggle from "../components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { User, Truck, User as DoctorIcon } from "lucide-react";
import SpeechToggle from "../components/SpeechToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const WelcomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  
  const englishText = "Welcome to ASHASEVA, your medicine delivery app. Are you a patient, a delivery partner, or a doctor?";
  const teluguText = "ASHASEVA కి స్వాగతం, మీ మందుల డెలివరీ యాప్. మీరు రోగి, డెలివరీ పార్ట్నర్ లేదా డాక్టర్?";
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - Medicine Delivery App";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="p-4 flex justify-end">
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <SpeechToggle 
            text={englishText} 
            teluguText={teluguText} 
          />
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 md:p-6">
        <img src="/ashaseva-logo.svg" alt="ASHASEVA Logo" className="w-24 h-24 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">ASHASEVA</h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-6 max-w-xl">
          {t(
            "Your Medicine Doorstep Delivery", 
            "మీ మందుల డోర్‌స్టెప్ డెలివరీ"
          )}
        </p>
        
        <div className={`w-full ${isMobile ? 'max-w-xs' : 'max-w-md'} space-y-4 mt-8`}>
          <Link to="/patient-login" className="block w-full">
            <Button className="btn-large w-full bg-primary hover:bg-primary/90">
              <User className="mr-2" />
              {t("I am a Patient", "నేను ఒక రోగిని")}
            </Button>
          </Link>
          
          <Link to="/admin-login" className="block w-full">
            <Button className="btn-large w-full bg-secondary hover:bg-secondary/90">
              <Truck className="mr-2" />
              {t("I am a Delivery Partner", "నేను డెలివరీ పార్ట్నర్‌ను")}
            </Button>
          </Link>
          
          <Link to="/doctor-login" className="block w-full">
            <Button className="btn-large w-full bg-green-600 hover:bg-green-700">
              <DoctorIcon className="mr-2" />
              {t("I am a Doctor", "నేను ఒక డాక్టర్‌ను")}
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="p-4 text-center text-gray-600 text-sm">
        {t(
          "© 2025 ASHASEVA - Rural Healthcare Initiative", 
          "© 2025 ASHASEVA - గ్రామీణ ఆరోగ్య చొరవ"
        )}
      </footer>
    </div>
  );
};

export default WelcomePage;
