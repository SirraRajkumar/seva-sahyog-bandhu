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

const DoctorLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState(""); // phone or id

  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const englishText = "Welcome to Doctor login. Please enter your registered mobile number or unique ID to continue.";
  const teluguText = "డాక్టర్ లాగిన్‌కు స్వాగతం. కొనసాగించడానికి దయచేసి మీ ఫోన్ నంబర్ లేదా ఐడి నమోదు చేయండి.";

  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - Doctor Login";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || identifier.length < 3) {
      toast({
        title: t("Invalid Input", "చెల్లని ఇన్‌పుట్"),
        description: t("Please enter a valid mobile number or unique ID", "దయచేసి ఫోన్ నంబర్ లేదా యూనిక్ ఐడి నమోదు చేయండి"),
        variant: "destructive",
      });
      return;
    }

    const user = login(identifier);
    if (user) {
      if (user.role === "doctor") {
        toast({
          title: t("Login Successful", "లాగిన్ విజయవంతమైంది"),
          description: t(`Welcome back, Dr. ${user.name}`, `తిరిగి స్వాగతం, డాక్టర్ ${user.name}`),
        });
        navigate("/doctor-dashboard");
      } else {
        toast({
          title: t("Wrong Login Type", "తప్పు లాగిన్ రకం"),
          description: t("This account is not a Doctor account", "ఈ ఖాతా డాక్టర్ ఖాతా కాదు"),
        });
      }
    } else {
      toast({
        title: t("Account Not Found", "ఖాతా కనుగొనబడలేదు"),
        description: t("No Doctor account found with this mobile number or ID", "ఈ ఫోన్ నంబర్ లేదా ఐడి‌తో డాక్టర్ ఖాతా కనుగొనబడలేదు"),
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
            <h1 className="text-2xl font-bold text-green-600">
              {t("Doctor Login", "డాక్టర్ లాగిన్")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("Access your doctor dashboard", "మీ డాక్టర్ డాష్‌బోర్డ్‌ని యాక్సెస్ చేయండి")}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id-or-phone">{t("Mobile Number or Unique ID", "ఫోన్ నంబర్ లేదా ఐడి")}</Label>
              <Input
                id="id-or-phone"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t("Enter phone number or ID", "ఫోన్ నంబర్ లేదా ఐడి నమోదు చేయండి")}
                className="text-lg p-6"
              />
            </div>
            <Button type="submit" className="w-full btn-large bg-green-600 hover:bg-green-700">
              <LogIn className="mr-2" />
              {t("Login", "లాగిన్")}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-4">
              {t(
                "Contact the hospital administration if you don't have login credentials.", 
                "మీకు లాగిన్ ఆధారాలు లేకుంటే ఆసుపత్రి నిర్వహణను సంప్రదించండి."
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
