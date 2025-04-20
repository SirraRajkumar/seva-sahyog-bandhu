
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import SpeechToggle from "../components/SpeechToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useToast } from "@/components/ui/use-toast";

const PatientLogin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [healthCardNumber, setHealthCardNumber] = useState("");
  const [area, setArea] = useState("");
  
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const englishLoginText = "Welcome to patient login. Please enter your phone number to continue.";
  const teluguLoginText = "రోగి లాగిన్‌కు స్వాగతం. కొనసాగించడానికి దయచేసి మీ ఫోన్ నెంబర్‌ను నమోదు చేయండి.";
  
  const englishRegisterText = "Please complete your registration by filling out all fields.";
  const teluguRegisterText = "దయచేసి అన్ని ఫీల్డ్‌లను నింపడం ద్వారా మీ నమోదును పూర్తి చేయండి.";

  const { speak } = useTextToSpeech({
    text: language === "english" 
      ? (isRegistering ? englishRegisterText : englishLoginText) 
      : (isRegistering ? teluguRegisterText : teluguLoginText),
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = isRegistering 
      ? "ASHASEVA - Patient Registration" 
      : "ASHASEVA - Patient Login";
  }, [isRegistering]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRegistering) {
      // Login flow
      if (!phone || phone.length < 10) {
        toast({
          title: t("Invalid Phone Number", "చెల్లని ఫోన్ నంబర్"),
          description: t("Please enter a valid 10-digit phone number", "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్‌ని నమోదు చేయండి"),
          variant: "destructive",
        });
        return;
      }
      
      const user = login(phone);
      if (user) {
        if (user.role === "patient") {
          toast({
            title: t("Login Successful", "లాగిన్ విజయవంతమైంది"),
            description: t(`Welcome back, ${user.name}`, `తిరిగి స్వాగతం, ${user.name}`),
          });
          navigate("/patient-dashboard");
        } else {
          toast({
            title: t("Wrong Login Type", "తప్పు లాగిన్ రకం"),
            description: t("This account is not a patient account", "ఈ ఖాతా రోగి ఖాతా కాదు"),
            variant: "destructive",
          });
        }
      } else {
        // User not found, switch to registration
        setIsRegistering(true);
      }
    } else {
      // Registration flow
      if (!name || !phone || !village || !healthCardNumber || !area) {
        toast({
          title: t("Incomplete Form", "అసంపూర్ణ ఫారమ్"),
          description: t("Please fill out all fields", "దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి"),
          variant: "destructive",
        });
        return;
      }
      
      if (phone.length < 10) {
        toast({
          title: t("Invalid Phone Number", "చెల్లని ఫోన్ నంబర్"),
          description: t("Please enter a valid 10-digit phone number", "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్‌ని నమోదు చేయండి"),
          variant: "destructive",
        });
        return;
      }
      
      const newUser = register({ name, phone, village, healthCardNumber, area });
      toast({
        title: t("Registration Successful", "నమోదు విజయవంతమైంది"),
        description: t(`Welcome, ${newUser.name}`, `స్వాగతం, ${newUser.name}`),
      });
      navigate("/patient-dashboard");
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
            text={isRegistering ? englishRegisterText : englishLoginText}
            teluguText={isRegistering ? teluguRegisterText : teluguLoginText}
          />
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">
              {isRegistering 
                ? t("Patient Registration", "రోగి నమోదు") 
                : t("Patient Login", "రోగి లాగిన్")}
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegistering 
                ? t("Create your healthcare account", "మీ ఆరోగ్య ఖాతాను సృష్టించండి") 
                : t("Access your healthcare account", "మీ ఆరోగ్య ఖాతాను యాక్సెస్ చేయండి")}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">{t("Full Name", "పూర్తి పేరు")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("Enter your full name", "మీ పూర్తి పేరును నమోదు చేయండి")}
                  className="text-lg p-6"
                />
              </div>
            )}
            
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
            
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="village">{t("Village", "గ్రామం")}</Label>
                  <Input
                    id="village"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={t("Enter your village name", "మీ గ్రామం పేరును నమోదు చేయండి")}
                    className="text-lg p-6"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="healthCard">{t("Health Card Number", "ఆరోగ్య కార్డ్ నంబర్")}</Label>
                  <Input
                    id="healthCard"
                    type="text"
                    value={healthCardNumber}
                    onChange={(e) => setHealthCardNumber(e.target.value)}
                    placeholder={t("Enter your health card number", "మీ ఆరోగ్య కార్డ్ నంబర్‌ను నమోదు చేయండి")}
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
                    placeholder={t("Enter your area code (e.g. AP001)", "మీ ప్రాంత కోడ్‌ను నమోదు చేయండి (ఉదా. AP001)")}
                    className="text-lg p-6"
                  />
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full btn-large">
              {isRegistering 
                ? (
                  <>
                    <UserPlus className="mr-2" />
                    {t("Register", "నమోదు చేయండి")}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" />
                    {t("Login", "లాగిన్")}
                  </>
                )
              }
            </Button>
            
            {!isRegistering && (
              <p className="text-center text-sm text-gray-600 mt-4">
                {t(
                  "New user? Enter your phone number and we'll help you register.", 
                  "కొత్త వినియోగదారు? మీ ఫోన్ నంబర్‌ను నమోదు చేయండి మరియు మేము మిమ్మల్ని నమోదు చేయడానికి సహాయం చేస్తాము."
                )}
              </p>
            )}
            
            {isRegistering && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsRegistering(false)}
              >
                {t("Back to Login", "లాగిన్‌కి తిరిగి వెళ్ళండి")}
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
