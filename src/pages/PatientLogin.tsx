
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
  const [identifier, setIdentifier] = useState(""); // input for phone or id
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  // REMOVE area from registration for consistency with login removal

  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const englishLoginText = "Welcome to patient login. Please enter your registered mobile number or unique ID to continue.";
  const teluguLoginText = "రోగి లాగిన్‌కు స్వాగతం. కొనసాగించడానికి దయచేసి మీ రిజిస్టర్ చేసిన ఫోన్ నెంబరు లేదా యూనిక్ ఐడి నమోదు చేయండి.";

  const englishRegisterText = "Please complete your registration by filling out all fields.";
  const teluguRegisterText = "దయచేసి అన్ని ఫీల్డ్‌లను నింపడం ద్వారా మీ నమోదును పూర్తి చేయండి.";

  const { speak } = useTextToSpeech({
    text: language === "english" 
      ? (isRegistering ? englishRegisterText : englishLoginText) 
      : (isRegistering ? teluguRegisterText : teluguLoginText),
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  // Check if user is already logged in, redirect if yes
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate("/patient-dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.title = isRegistering 
      ? "ASHASEVA - Patient Registration" 
      : "ASHASEVA - Patient Login";
  }, [isRegistering]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form. Is registering:", isRegistering);

    if (!isRegistering) {
      if (!identifier || identifier.length < 3) {
        toast({
          title: t("Invalid Input", "చెల్లని ఇన్‌పుట్"),
          description: t("Please enter a valid mobile number or unique ID", "దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ లేదా యూనిక్ ఐడి నమోదు చేయండి"),
          variant: "destructive",
        });
        return;
      }
      
      console.log("Attempting to login with identifier:", identifier);
      const user = login(identifier);
      
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
          });
        }
      } else {
        console.log("User not found. Switching to registration mode");
        toast({
          title: t("User Not Found", "వినియోగదారు కనుగొనబడలేదు"),
          description: t("Please register as a new user", "దయచేసి కొత్త వినియోగదారుగా నమోదు చేయండి"),
        });
        setIsRegistering(true);
      }
    } else {
      if (!name || !identifier || !village) {
        toast({
          title: t("Incomplete Form", "అసంపూర్ణ ఫారమ్"),
          description: t("Please fill out all fields", "దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి"),
          variant: "destructive",
        });
        return;
      }
      if (identifier.length < 10 && identifier.length < 3) {
        toast({
          title: t("Invalid Input", "చెల్లని ఇన్‌పుట్"),
          description: t("Please enter a valid mobile number or unique ID", "దయచేసి ఫోన్ నంబర్ లేదా యూనిక్ ఐడి నమోదు చేయండి"),
          variant: "destructive",
        });
        return;
      }
      
      console.log("Registering new user with data:", { name, phone: identifier, village });
      const newUser = register({ name, phone: identifier, village, area: "" });
      
      toast({
        title: t("Registration Successful", "నమోదు విజయవంతమైంది"),
        description: t(
          `Welcome, ${newUser.name}!`,
          `స్వాగతం, ${newUser.name}!`
        ),
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
                  "New user? Enter your mobile number or ID and we'll help you register.", 
                  "కొత్త వినియోగదారు? మీ ఫోన్ నంబర్ లేదా ఐడి నమోదు చేయండి మరియు మేము మిమ్మల్ని నమోదు చేయడానికి సహాయం చేస్తాము."
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
