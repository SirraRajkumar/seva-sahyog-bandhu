
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { symptoms, findRequestsByUserId, hasSubmittedRequestToday, saveRequest } from "../data/mockData";
import AppHeader from "../components/AppHeader";
import SymptomCard from "../components/SymptomCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

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
    
    // Check if the user has already submitted a request today
    if (currentUser) {
      const submitted = hasSubmittedRequestToday(currentUser.id);
      setAlreadySubmitted(submitted);
      
      // Get past requests
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
    
    // Save the request
    const request = saveRequest({
      userId: currentUser.id,
      symptom: selectedSymptom,
      duration: duration,
    });
    
    // Update UI
    setAlreadySubmitted(true);
    setPastRequests([...pastRequests, request]);
    
    // Close dialog and show success message
    setIsDialogOpen(false);
    
    toast({
      title: t("Request Submitted", "అభ్యర్థన సమర్పించబడింది"),
      description: t("Your health request has been sent to your ASHA worker", "మీ ఆరోగ్య అభ్యర్థన మీ ASHA కార్యకర్తకు పంపబడింది"),
    });
    
    // Reset selections
    setSelectedSymptom(null);
    setDuration(1);
  };

  const getSymptomName = (id: string) => {
    const symptom = symptoms.find(s => s.id === id);
    return symptom 
      ? (language === "english" ? symptom.name.english : symptom.name.telugu) 
      : id;
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("Pending", "పెండింగ్‌లో ఉంది");
      case "reviewed":
        return t("Reviewed", "సమీక్షించబడింది");
      case "urgent":
        return t("Urgent", "అత్యవసర");
      case "completed":
        return t("Completed", "పూర్తయింది");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("Hello", "హలో")}, {currentUser.name}
          </h1>
          <p className="text-gray-600">
            {t(
              "How are you feeling today?", 
              "మీరు ఈరోజు ఎలా ఫీల్ అవుతున్నారు?"
            )}
          </p>
          
          {alreadySubmitted && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">
                {t(
                  "You've already submitted a health request today. An ASHA worker will contact you soon.",
                  "మీరు ఇప్పటికే ఈరోజు ఆరోగ్య అభ్యర్థనను సమర్పించారు. ASHA కార్యకర్త త్వరలో మిమ్మల్ని సంప్రదిస్తారు."
                )}
              </p>
            </div>
          )}
        </div>
        
        {!alreadySubmitted && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("Select a Symptom", "లక్షణాన్ని ఎంచుకోండి")}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {symptoms.map((symptom) => (
                <SymptomCard 
                  key={symptom.id}
                  symptom={symptom}
                  onClick={() => handleSymptomSelect(symptom.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {pastRequests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("Your Past Requests", "మీ గత అభ్యర్థనలు")}
            </h2>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        {t("Date", "తేదీ")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        {t("Symptom", "లక్షణం")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        {t("Duration", "వ్యవధి")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        {t("Status", "స్థితి")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pastRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {request.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {getSymptomName(request.symptom)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {request.duration} {t("days", "రోజులు")}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t("How long have you been feeling this way?", "మీరు ఎంతకాలంగా ఇలా ఫీల్ అవుతున్నారు?")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Tell us how many days you've been experiencing this symptom.",
                "మీరు ఈ లక్షణాన్ని ఎన్ని రోజులుగా అనుభవిస్తున్నారో మాకు చెప్పండి."
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col items-center space-y-6">
              <span className="text-4xl font-bold text-primary">
                {duration} {t("days", "రోజులు")}
              </span>
              
              <Slider
                value={[duration]}
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => setDuration(values[0])}
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("Cancel", "రద్దు చేయండి")}
            </Button>
            <Button onClick={handleSubmitSymptom}>
              {t("Submit", "సమర్పించండి")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
