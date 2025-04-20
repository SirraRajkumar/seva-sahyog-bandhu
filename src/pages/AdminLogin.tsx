
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn } from "lucide-react";
import SpeechToggle from "../components/SpeechToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const englishText = "Welcome to ASHA worker login. Please enter your phone number and area code to continue.";
  const teluguText = "ASHA కార్యకర్త లాగిన్‌కు స్వాగతం. కొనసాగించడానికి దయచేసి మీ ఫోన్ నంబర్ మరియు ప్రాంత కోడ్‌ను నమోదు చేయండి.";
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - ASHA Worker Login";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10 || !area) {
      toast({
        title: t("Invalid Input", "చెల్లని ఇన్‌పుట్"),
        description: t("Please enter a valid phone number and area code", "దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ మరియు ప్రాంత కోడ్‌ను నమోదు చేయండి"),
        variant: "destructive",
      });
      return;
    }
    
    const user = login(phone);
    if (user) {
      if (user.role === "admin" && user.area === area) {
        toast({
          title: t("Login Successful", "లాగిన్ విజయవంతమైంది"),
          description: t(`Welcome back, ${user.name}`, `తిరిగి స్వాగతం, ${user.name}`),
        });
        navigate("/admin-dashboard");
      } else if (user.role !== "admin") {
        toast({
          title: t("Wrong Login Type", "తప్పు లాగిన్ రకం"),
          description: t("This account is not an ASHA worker account", "ఈ ఖాతా ASHA కార్యకర్త ఖాతా కాదు"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("Wrong Area Code", "తప్పు ప్రాంత కోడ్"),
          description: t("The area code does not match our records", "ప్రాంత కోడ్ మా రికార్డులతో సరిపోలడం లేదు"),
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: t("Account Not Found", "ఖాతా కనుగొనబడలేదు"),
        description: t("No ASHA worker account found with this phone number", "ఈ ఫోన్ నంబర్‌తో ASHA కార్యకర్త ఖాతా కనుగొనబడలేదు"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="p-4 flex justify-between">
        <Link to="/" className="text-gray-700 hover:text-primary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>{t("Back", "వెనుకకు")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <SpeechToggle 
            text={englishText}
            teluguText={teluguText}
          />
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-secondary">
              {t("ASHA Worker Login", "ASHA కార్యకర్త లాగిన్")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("Access your healthcare worker account", "మీ ఆరోగ్య కార్యకర్త ఖాతాను యాక్సెస్ చేయండి")}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("Phone Number", "ఫోన్ నంబర్")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("Enter your phone number", "మీ ఫోన్ నంబర్‌ను నమోదు చేయండి")}
                className="text-lg p-6"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">{t("Area Code", "ఏరియా కోడ్")}</Label>
              <Input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={t("Enter your area code", "మీ ప్రాంత కోడ్‌ను నమోదు చేయండి")}
                className="text-lg p-6"
              />
            </div>
            
            <Button type="submit" className="w-full btn-large bg-secondary hover:bg-secondary/90">
              <LogIn className="mr-2" />
              {t("Login", "లాగిన్")}
            </Button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              {t(
                "Contact your supervisor if you don't have login credentials.", 
                "మీకు లాగిన్ ఆధారాలు లేకుంటే మీ సూపర్‌వైజర్‌ని సంప్రదించండి."
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
