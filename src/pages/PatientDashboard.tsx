import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { symptoms, findRequestsByUserId, hasSubmittedRequestToday, saveRequest } from "../data/mockData";
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
import ProfileCompletion from "@/components/patient/ProfileCompletion";

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const englishText = `Welcome ${currentUser?.name}. Please select a symptom you are experiencing, or view your past requests.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. దయచేసి మీరు అనుభవిస్తున్న లక్షణాన్ని ఎంచుకోండి లేదా మీ గత అభ్యర్థనలను చూడండి.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  const isProfileComplete = currentUser && 
    currentUser.name && 
    currentUser.village && 
    currentUser.healthCardNumber && 
    currentUser.area;

  useEffect(() => {
    document.title = "ASHASEVA - Patient Dashboard";
    
    if (!currentUser) {
      navigate("/");
      return;
    }
    
    if (currentUser) {
      const submitted = hasSubmittedRequestToday(currentUser.id);
      setAlreadySubmitted(submitted);
      
      const requests = findRequestsByUserId(currentUser.id);
      setPastRequests(requests);
    }
  }, [currentUser, navigate]);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [pastRequests, setPastRequests] = useState<any[]>([]);

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
        `Your health request with ${selectedSymptoms.length} symptoms has been sent to your ASHA worker`,
        `${selectedSymptoms.length} లక్షణాలతో మీ ఆరోగ్య అభ్యర్థన మీ ASHA కార్యకర్తకు పంపబడింది`
      ),
    });
    
    setSelectedSymptoms([]);
    setDuration(1);
  };

  const getSymptomName = (id: string) => {
    const symptom = symptoms.find(s => s.id === id);
    return symptom 
      ? (language === "english" ? symptom.name.english : symptom.name.telugu) 
      : id;
  };

  if (!currentUser) return null;
  
  if (!isProfileComplete) {
    return <ProfileCompletion />;
  }

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
            {!alreadySubmitted && (
              <SubmitRequestSection
                symptoms={symptoms}
                selectedSymptoms={selectedSymptoms}
                onSymptomSelect={handleSymptomSelect}
                onSubmit={handleSubmitSymptoms}
              />
            )}
            <HealthTimeline userId={currentUser?.id || ""} />
            <EmergencyContacts />
          </div>
          
          <div className="space-y-6">
            <AppointmentSection />
            <MedicineReminders />
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
