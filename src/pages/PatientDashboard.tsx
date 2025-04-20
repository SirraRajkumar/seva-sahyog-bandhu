
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
import PastRequestsTable from "@/components/patient/PastRequestsTable";

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [pastRequests, setPastRequests] = useState<any[]>([]);
  
  const englishText = `Welcome ${currentUser?.name}. Please select a symptom you are experiencing, or view your past requests.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. దయచేసి మీరు అనుభవిస్తున్న లక్షణాన్ని ఎంచుకోండి లేదా మీ గత అభ్యర్థనలను చూడండి.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

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

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptom(symptomId);
    setIsDialogOpen(true);
  };

  const handleSubmitSymptom = () => {
    if (!currentUser || !selectedSymptom) return;
    
    const request = saveRequest({
      userId: currentUser.id,
      symptom: selectedSymptom,
      duration: duration,
    });
    
    setAlreadySubmitted(true);
    setPastRequests([...pastRequests, request]);
    setIsDialogOpen(false);
    
    toast({
      title: t("Request Submitted", "అభ్యర్థన సమర్పించబడింది"),
      description: t("Your health request has been sent to your ASHA worker", "మీ ఆరోగ్య అభ్యర్థన మీ ASHA కార్యకర్తకు పంపబడింది"),
    });
    
    setSelectedSymptom(null);
    setDuration(1);
  };

  const getSymptomName = (id: string) => {
    const symptom = symptoms.find(s => s.id === id);
    return symptom 
      ? (language === "english" ? symptom.name.english : symptom.name.telugu) 
      : id;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <WelcomeHeader 
          name={currentUser.name}
          alreadySubmitted={alreadySubmitted}
        />
        
        {!alreadySubmitted && (
          <SubmitRequestSection
            symptoms={symptoms}
            onSymptomSelect={handleSymptomSelect}
          />
        )}
        
        {pastRequests.length > 0 && (
          <PastRequestsTable
            requests={pastRequests}
            getSymptomName={getSymptomName}
          />
        )}
      </main>

      <HealthRequestDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        duration={duration}
        onDurationChange={(values) => setDuration(values[0])}
        onSubmit={handleSubmitSymptom}
      />
    </div>
  );
};

export default PatientDashboard;
