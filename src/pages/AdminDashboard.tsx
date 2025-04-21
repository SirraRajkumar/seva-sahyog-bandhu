import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import AppHeader from "../components/AppHeader";
import StatsOverview from "../components/admin/StatsOverview";
import RequestsList from "../components/admin/RequestsList";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const englishText = `Welcome ${currentUser?.name}. You can view all patients in your area, deliver tablets, and monitor their log data.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. మీరు మీ ప్రాంతంలోని అన్ని రోగులను చూసి, టాబ్లెట్‌లను డెలివరీ చేసి వారి లాగ్ డేటాను పర్యవేక్షించవచ్చు.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - Delivery Partner Dashboard";
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("Delivery Partner Dashboard", "డెలివరీ పార్ట్నర్ డాష్‌బోర్డ్")}
          </h1>
          <p className="text-gray-600">
            {t(
              `Area Code: ${currentUser.area}`,
              `ఏరియా కోడ్: ${currentUser.area}`
            )}
          </p>
        </div>
        <StatsOverview />
        <RequestsList />
      </main>
    </div>
  );
};

export default AdminDashboard;
