
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import AppHeader from "../components/AppHeader";
import { findPatientsByArea, findRequestsByArea } from "../data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientsList from "../components/doctor/PatientsList";
import HealthRequests from "../components/doctor/HealthRequests";

const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const englishText = `Welcome Dr. ${currentUser?.name}. You can review patient health requests and monitor their medication logs.`;
  const teluguText = `స్వాగతం డాక్టర్ ${currentUser?.name}. మీరు రోగుల ఆరోగ్య అభ్యర్థనలను సమీక్షించవచ్చు మరియు వారి మందుల లాగ్‌లను పర్యవేక్షించవచ్చు.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - Doctor Dashboard";
    if (!currentUser || currentUser.role !== "doctor") {
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
            {t("Doctor Dashboard", "డాక్టర్ డాష్‌బోర్డ్")}
          </h1>
          <p className="text-gray-600">
            {t(
              `Area: ${currentUser.area} | ${currentUser.village}`,
              `ప్రాంతం: ${currentUser.area} | ${currentUser.village}`
            )}
          </p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="requests">
            <TabsList className="mb-4">
              <TabsTrigger value="requests">
                {t("Health Requests", "ఆరోగ్య అభ్యర్థనలు")}
              </TabsTrigger>
              <TabsTrigger value="patients">
                {t("Patients", "రోగులు")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <HealthRequests />
            </TabsContent>
            
            <TabsContent value="patients">
              <PatientsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
