
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import AppHeader from "../components/AppHeader";
import StatsOverview from "../components/admin/StatsOverview";
import DeliveryOrdersList from "../components/admin/DeliveryOrdersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("pending");
  
  const englishText = `Welcome ${currentUser?.name}. You can view all pending medicine orders in your area, deliver them, and mark them as completed.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. మీరు మీ ప్రాంతంలోని అన్ని పెండింగ్ మందుల ఆర్డర్లను చూడవచ్చు, వాటిని డెలివరీ చేయవచ్చు మరియు పూర్తయినట్లుగా గుర్తించవచ్చు.`;
  
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
        
        <div className="mb-6 mt-8">
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="pending">
                {t("Pending Orders", "పెండింగ్ ఆర్డర్లు")}
              </TabsTrigger>
              <TabsTrigger value="delivering">
                {t("Out for Delivery", "డెలివరీకి బయలుదేరాయి")}
              </TabsTrigger>
              <TabsTrigger value="delivered">
                {t("Delivered", "డెలివరీ అయినవి")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <DeliveryOrdersList status="pending" currentArea={currentUser.area} />
            </TabsContent>
            
            <TabsContent value="delivering">
              <DeliveryOrdersList status="delivering" currentArea={currentUser.area} />
            </TabsContent>
            
            <TabsContent value="delivered">
              <DeliveryOrdersList status="delivered" currentArea={currentUser.area} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
