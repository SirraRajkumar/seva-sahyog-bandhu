import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { 
  symptoms, 
  findRequestsByUserId, 
  hasSubmittedRequestToday, 
  saveRequest,
  findOrdersByUserId 
} from "../data/mockData";
import AppHeader from "../components/AppHeader";
import { useToast } from "@/components/ui/use-toast";
import WelcomeHeader from "@/components/patient/WelcomeHeader";
import SubmitRequestSection from "@/components/patient/SubmitRequestSection";
import HealthRequestDialog from "@/components/patient/HealthRequestDialog";
import HealthTimeline from "@/components/patient/HealthTimeline";
import HealthStats from "@/components/patient/HealthStats";
import AppointmentSection from "@/components/patient/AppointmentSection";
import MedicineReminders from "@/components/patient/MedicineReminders";
import EmergencyContacts from "@/components/patient/EmergencyContacts";
import HealthTips from "@/components/patient/HealthTips";
import MedicineOrderSection from "@/components/patient/MedicineOrderSection";
import OrderHistory from "@/components/patient/OrderHistory";

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const englishText = `Welcome ${currentUser?.name}. You can order medicine or report your symptoms for the doctor to review.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. మీరు మందులను ఆర్డర్ చేయవచ్చు లేదా డాక్టర్ సమీక్షించడానికి మీ లక్షణాలను నివేదించవచ్చు.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  const [hasOrders, setHasOrders] = useState(false);
  const [ordersUpdated, setOrdersUpdated] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [pastRequests, setPastRequests] = useState<any[]>([]);
  
  // Check if profile is complete (all required fields filled)
  const isProfileComplete = currentUser && 
    currentUser.name && 
    currentUser.name.trim() !== "" && 
    currentUser.village && 
    currentUser.village.trim() !== "";

  useEffect(() => {
    document.title = "ASHASEVA - Patient Dashboard";
    
    if (!currentUser) {
      console.log("No current user, redirecting to login");
      navigate("/");
      return;
    }
    
    // If profile is incomplete, redirect to profile completion page
    if (!isProfileComplete) {
      console.log("Profile incomplete, redirecting to profile completion");
      navigate("/profile-completion");
      return;
    }
    
    if (currentUser) {
      console.log("Current user:", currentUser);
      console.log("Profile complete:", isProfileComplete);
      
      const submitted = hasSubmittedRequestToday(currentUser.id);
      setAlreadySubmitted(submitted);
      
      const requests = findRequestsByUserId(currentUser.id);
      setPastRequests(requests);
      
      // Check if user has any medicine orders
      const orders = findOrdersByUserId(currentUser.id);
      setHasOrders(orders.length > 0);
    }
  }, [currentUser, navigate, ordersUpdated, isProfileComplete]);

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      }
      return [...prev, symptomId];
    });
  };

  const handleSubmitSymptoms = () => {
    if (selectedSymptoms.length > 0) {
      setIsDialogOpen(true);
    }
  };

  const handleSubmitRequest = () => {
    if (!currentUser || selectedSymptoms.length === 0) return;
    
    selectedSymptoms.forEach(symptomId => {
      const request = saveRequest({
        userId: currentUser.id,
        symptom: symptomId,
        duration: duration,
      });
      setPastRequests(prev => [...prev, request]);
    });
    
    setAlreadySubmitted(true);
    setIsDialogOpen(false);
    
    toast({
      title: t("Request Submitted", "అభ్యర్థన సమర్పించబడింది"),
      description: t(
        `Your health request with ${selectedSymptoms.length} symptoms has been sent to your doctor`,
        `${selectedSymptoms.length} లక్షణాలతో మీ ఆరోగ్య అభ్యర్థన మీ డాక్టర్‌కు పంపబడింది`
      ),
    });
    
    setSelectedSymptoms([]);
    setDuration(1);
  };

  const handleOrderPlaced = () => {
    setOrdersUpdated(prev => prev + 1);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <WelcomeHeader 
          name={currentUser?.name || ""}
          alreadySubmitted={alreadySubmitted}
        />
        
        <HealthStats userId={currentUser?.id || ""} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <MedicineOrderSection onOrderPlaced={handleOrderPlaced} />
            {hasOrders && <OrderHistory />}
            {!alreadySubmitted && (
              <SubmitRequestSection
                symptoms={symptoms}
                selectedSymptoms={selectedSymptoms}
                onSymptomSelect={handleSymptomSelect}
                onSubmit={handleSubmitSymptoms}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <HealthTimeline userId={currentUser?.id || ""} />
            <MedicineReminders />
            <EmergencyContacts />
            <HealthTips />
          </div>
        </div>

        <HealthRequestDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          duration={duration}
          onDurationChange={(values) => setDuration(values[0])}
          onSubmit={handleSubmitRequest}
        />
      </main>
    </div>
  );
};

export default PatientDashboard;
