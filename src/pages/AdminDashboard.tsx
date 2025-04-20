
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { findRequestsByArea, findPatientsByArea, findUserByPhone, users } from "../data/mockData";
import AppHeader from "../components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, UserCircle, Clock, AlertCircle, CheckCircle, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HealthRequest, User } from "../types";
import { Separator } from "@/components/ui/separator";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState<HealthRequest[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [patientRequests, setPatientRequests] = useState<HealthRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPatients, setFilteredPatients] = useState<User[]>([]);
  
  const englishText = `Welcome ${currentUser?.name}. You can view all patients in your area and their health requests.`;
  const teluguText = `స్వాగతం ${currentUser?.name}. మీరు మీ ప్రాంతంలోని అన్ని రోగులను మరియు వారి ఆరోగ్య అభ్యర్థనలను చూడవచ్చు.`;
  
  const { speak } = useTextToSpeech({
    text: language === "english" ? englishText : teluguText,
    language: language === "english" ? "en-IN" : "te-IN",
    autoSpeak: true,
  });

  useEffect(() => {
    document.title = "ASHASEVA - ASHA Worker Dashboard";
    
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    
    // Load data for the admin's area
    if (currentUser) {
      const areaRequests = findRequestsByArea(currentUser.area);
      const areaPatients = findPatientsByArea(currentUser.area);
      
      setRequests(areaRequests);
      setPatients(areaPatients);
      setFilteredPatients(areaPatients);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Filter patients based on search query
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery) ||
          patient.village.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const handlePatientClick = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      const patientReqs = requests.filter(req => req.userId === patientId);
      setPatientRequests(patientReqs);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">{t("Pending", "పెండింగ్‌లో ఉంది")}</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">{t("Reviewed", "సమీక్షించబడింది")}</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">{t("Urgent", "అత్యవసర")}</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">{t("Completed", "పూర్తయింది")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPendingRequestsCount = () => {
    return requests.filter(req => req.status === "pending").length;
  };

  const getUrgentRequestsCount = () => {
    return requests.filter(req => req.status === "urgent").length;
  };

  if (!currentUser) return null;

  const pendingRequests = requests.filter(req => req.status === "pending");
  const urgentRequests = requests.filter(req => req.status === "urgent");
  const otherRequests = requests.filter(req => req.status !== "pending" && req.status !== "urgent");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("ASHA Worker Dashboard", "ASHA కార్యకర్త డాష్‌బోర్డ్")}
          </h1>
          <p className="text-gray-600">
            {t(
              `Area Code: ${currentUser.area} - Managing ${patients.length} patients`, 
              `ఏరియా కోడ్: ${currentUser.area} - ${patients.length} మంది రోగులను నిర్వహిస్తోంది`
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("Patients", "రోగులు")}</CardTitle>
              <CardDescription>{t("Total in your area", "మీ ప్రాంతంలో మొత్తం")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 text-blue-500 mr-3" />
                <span className="text-3xl font-bold">{patients.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("Pending Requests", "పెండింగ్ అభ్యర్థనలు")}</CardTitle>
              <CardDescription>{t("Need attention", "దృష్టి అవసరం")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                <span className="text-3xl font-bold">{getPendingRequestsCount()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("Urgent Cases", "అత్యవసర సందర్భాలు")}</CardTitle>
              <CardDescription>{t("High priority", "అధిక ప్రాధాన్యత")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                <span className="text-3xl font-bold">{getUrgentRequestsCount()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="requests">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="requests">{t("Health Requests", "ఆరోగ్య అభ్యర్థనలు")}</TabsTrigger>
            <TabsTrigger value="patients">{t("Manage Patients", "రోగులను నిర్వహించండి")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>{t("Health Requests", "ఆరోగ్య అభ్యర్థనలు")}</CardTitle>
                <CardDescription>
                  {t("View and manage patient health requests", "రోగి ఆరోగ్య అభ్యర్థనలను వీక్షించండి మరియు నిర్వహించండి")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {t("No health requests at the moment", "ప్రస్తుతం ఆరోగ్య అభ్యర్థనలు లేవు")}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {urgentRequests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-red-600 mb-3 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          {t("Urgent Requests", "అత్యవసర అభ్యర్థనలు")}
                        </h3>
                        <div className="space-y-3">
                          {urgentRequests.map((request) => {
                            const patient = users.find(u => u.id === request.userId);
                            return (
                              <div 
                                key={request.id} 
                                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{patient?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {t("Village", "గ్రామం")}: {patient?.village}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {t("Reported on", "నివేదించబడింది")}: {request.date}
                                    </p>
                                    <div className="mt-2">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        {t("View Details", "వివరాలను చూడండి")}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{t("Patient Details", "రోగి వివరాలు")}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Name", "పేరు")}</p>
                                            <p className="font-medium">{patient?.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Phone", "ఫోన్")}</p>
                                            <p className="font-medium">{patient?.phone}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Village", "గ్రామం")}</p>
                                            <p className="font-medium">{patient?.village}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Health Card", "ఆరోగ్య కార్డ్")}</p>
                                            <p className="font-medium">{patient?.healthCardNumber}</p>
                                          </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">{t("Request Details", "అభ్యర్థన వివరాలు")}</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Symptom", "లక్షణం")}</p>
                                              <p className="font-medium">{request.symptom}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Duration", "వ్యవధి")}</p>
                                              <p className="font-medium">{request.duration} {t("days", "రోజులు")}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Reported On", "నివేదించబడింది")}</p>
                                              <p className="font-medium">{request.date}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Status", "స్థితి")}</p>
                                              <div>{getStatusBadge(request.status)}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" size="sm">
                                          {t("Mark as Reviewed", "సమీక్షించినట్లుగా గుర్తించండి")}
                                        </Button>
                                        <Button size="sm">
                                          {t("Update Status", "స్థితిని నవీకరించండి")}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {pendingRequests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-yellow-600 mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          {t("Pending Requests", "పెండింగ్ అభ్యర్థనలు")}
                        </h3>
                        <div className="space-y-3">
                          {pendingRequests.map((request) => {
                            const patient = users.find(u => u.id === request.userId);
                            return (
                              <div 
                                key={request.id} 
                                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{patient?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {t("Village", "గ్రామం")}: {patient?.village}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {t("Reported on", "నివేదించబడింది")}: {request.date}
                                    </p>
                                    <div className="mt-2">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        {t("View Details", "వివరాలను చూడండి")}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{t("Patient Details", "రోగి వివరాలు")}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Name", "పేరు")}</p>
                                            <p className="font-medium">{patient?.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Phone", "ఫోన్")}</p>
                                            <p className="font-medium">{patient?.phone}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Village", "గ్రామం")}</p>
                                            <p className="font-medium">{patient?.village}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Health Card", "ఆరోగ్య కార్డ్")}</p>
                                            <p className="font-medium">{patient?.healthCardNumber}</p>
                                          </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">{t("Request Details", "అభ్యర్థన వివరాలు")}</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Symptom", "లక్షణం")}</p>
                                              <p className="font-medium">{request.symptom}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Duration", "వ్యవధి")}</p>
                                              <p className="font-medium">{request.duration} {t("days", "రోజులు")}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Reported On", "నివేదించబడింది")}</p>
                                              <p className="font-medium">{request.date}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Status", "స్థితి")}</p>
                                              <div>{getStatusBadge(request.status)}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" size="sm">
                                          {t("Mark as Reviewed", "సమీక్షించినట్లుగా గుర్తించండి")}
                                        </Button>
                                        <Button size="sm">
                                          {t("Update Status", "స్థితిని నవీకరించండి")}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {otherRequests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-green-600 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {t("Other Requests", "ఇతర అభ్యర్థనలు")}
                        </h3>
                        <div className="space-y-3">
                          {otherRequests.map((request) => {
                            const patient = users.find(u => u.id === request.userId);
                            return (
                              <div 
                                key={request.id} 
                                className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{patient?.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {t("Village", "గ్రామం")}: {patient?.village}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {t("Reported on", "నివేదించబడింది")}: {request.date}
                                    </p>
                                    <div className="mt-2">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        {t("View Details", "వివరాలను చూడండి")}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{t("Patient Details", "రోగి వివరాలు")}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Name", "పేరు")}</p>
                                            <p className="font-medium">{patient?.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Phone", "ఫోన్")}</p>
                                            <p className="font-medium">{patient?.phone}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Village", "గ్రామం")}</p>
                                            <p className="font-medium">{patient?.village}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Health Card", "ఆరోగ్య కార్డ్")}</p>
                                            <p className="font-medium">{patient?.healthCardNumber}</p>
                                          </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">{t("Request Details", "అభ్యర్థన వివరాలు")}</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Symptom", "లక్షణం")}</p>
                                              <p className="font-medium">{request.symptom}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Duration", "వ్యవధి")}</p>
                                              <p className="font-medium">{request.duration} {t("days", "రోజులు")}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Reported On", "నివేదించబడింది")}</p>
                                              <p className="font-medium">{request.date}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">{t("Status", "స్థితి")}</p>
                                              <div>{getStatusBadge(request.status)}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button size="sm">
                                          {t("Update Status", "స్థితిని నవీకరించండి")}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>{t("Manage Patients", "రోగులను నిర్వహించండి")}</CardTitle>
                <CardDescription>
                  {t("View and manage patients in your area", "మీ ప్రాంతంలోని రోగులను వీక్షించండి మరియు నిర్వహించండి")}
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder={t("Search patients by name, phone, or village...", "పేరు, ఫోన్ లేదా గ్రామం ద్వారా రోగులను శోధించండి...")}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery 
                      ? t("No patients found matching your search", "మీ శోధనకు సరిపోలే రోగులు కనుగొనబడలేదు")
                      : t("No patients in your area", "మీ ప్రాంతంలో రోగులు లేరు")
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPatients.map((patient) => (
                      <Dialog key={patient.id}>
                        <DialogTrigger asChild>
                          <div className="p-4 bg-white border rounded-lg hover:border-primary hover:shadow-sm cursor-pointer transition-all">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{patient.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {t("Phone", "ఫోన్")}: {patient.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {t("Village", "గ్రామం")}: {patient.village}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {t("Health Card", "ఆరోగ్య కార్డ్")}: {patient.healthCardNumber}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost">
                                {t("View Details", "వివరాలను చూడండి")}
                              </Button>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>{t("Patient Information", "రోగి సమాచారం")}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            <div>
                              <h3 className="text-lg font-medium mb-3">{t("Personal Details", "వ్యక్తిగత వివరాలు")}</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">{t("Name", "పేరు")}</p>
                                  <p className="font-medium">{patient.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">{t("Phone", "ఫోన్")}</p>
                                  <p className="font-medium">{patient.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">{t("Village", "గ్రామం")}</p>
                                  <p className="font-medium">{patient.village}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">{t("Health Card", "ఆరోగ్య కార్డ్")}</p>
                                  <p className="font-medium">{patient.healthCardNumber}</p>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-lg font-medium mb-3">{t("Health Requests", "ఆరోగ్య అభ్యర్థనలు")}</h3>
                              {requests.filter(req => req.userId === patient.id).length === 0 ? (
                                <p className="text-gray-500">{t("No health requests submitted", "సమర్పించబడిన ఆరోగ్య అభ్యర్థనలు లేవు")}</p>
                              ) : (
                                <div className="space-y-4">
                                  {requests
                                    .filter(req => req.userId === patient.id)
                                    .map((request) => (
                                      <div key={request.id} className="p-3 bg-gray-50 rounded-lg border">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Date", "తేదీ")}</p>
                                            <p className="font-medium">{request.date}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Status", "స్థితి")}</p>
                                            <div>{getStatusBadge(request.status)}</div>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Symptom", "లక్షణం")}</p>
                                            <p className="font-medium">{request.symptom}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">{t("Duration", "వ్యవధి")}</p>
                                            <p className="font-medium">{request.duration} {t("days", "రోజులు")}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
