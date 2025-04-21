
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell, 
  TableBody 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, File } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  findRequestsByArea, 
  findSymptomById, 
  findUserById, 
  updateRequestStatus,
  HealthRequest
} from "../../data/mockData";

interface HealthRequestsProps {
  areaCode: string;
}

const HealthRequests: React.FC<HealthRequestsProps> = ({ areaCode }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [requests, setRequests] = useState<HealthRequest[]>([]);
  
  const refreshRequests = () => {
    const areaRequests = findRequestsByArea(areaCode);
    setRequests(areaRequests);
  };
  
  useEffect(() => {
    refreshRequests();
  }, [areaCode]);
  
  const getSymptomName = (symptomId: string) => {
    const symptom = findSymptomById(symptomId);
    return symptom ? (language === "english" ? symptom.name.english : symptom.name.telugu) : symptomId;
  };
  
  const getPatientName = (userId: string) => {
    const user = findUserById(userId);
    return user ? user.name : "Unknown";
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">{t("Pending", "పెండింగ్")}</Badge>;
      case "reviewed":
        return <Badge variant="default">{t("Reviewed", "సమీక్షించబడింది")}</Badge>;
      case "urgent":
        return <Badge variant="destructive">{t("Urgent", "అత్యవసర")}</Badge>;
      case "completed":
        return <Badge variant="success">{t("Completed", "పూర్తయింది")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleUpdateStatus = (requestId: string, newStatus: "reviewed" | "urgent" | "completed") => {
    const updated = updateRequestStatus(requestId, newStatus);
    
    if (updated) {
      toast({
        title: t("Request Updated", "అభ్యర్థన నవీకరించబడింది"),
        description: t(
          `Request status updated to ${newStatus}`,
          `అభ్యర్థన స్థితి ${newStatus}కి నవీకరించబడింది`
        )
      });
      
      refreshRequests();
    }
  };
  
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <File className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">
              {t("No Requests", "అభ్యర్థనలు లేవు")}
            </h3>
            <p>
              {t("No health requests from patients in your area", "మీ ప్రాంతంలోని రోగుల నుండి ఆరోగ్య అభ్యర్థనలు లేవు")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          {t("Patient Health Requests", "రోగి ఆరోగ్య అభ్యర్థనలు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Patient", "రోగి")}</TableHead>
              <TableHead>{t("Symptom", "లక్షణం")}</TableHead>
              <TableHead>{t("Duration (Days)", "వ్యవధి (రోజులు)")}</TableHead>
              <TableHead>{t("Date", "తేదీ")}</TableHead>
              <TableHead>{t("Status", "స్థితి")}</TableHead>
              <TableHead>{t("Actions", "చర్యలు")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{getPatientName(request.userId)}</TableCell>
                <TableCell>{getSymptomName(request.symptom)}</TableCell>
                <TableCell>{request.duration}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(request.id, "reviewed")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t("Mark Reviewed", "సమీక్షించినట్లు గుర్తించండి")}
                        </Button>
                        
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(request.id, "urgent")}
                        >
                          {t("Mark Urgent", "అత్యవసరంగా గుర్తించండి")}
                        </Button>
                      </>
                    )}
                    
                    {(request.status === "reviewed" || request.status === "urgent") && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleUpdateStatus(request.id, "completed")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t("Complete", "పూర్తి చేయండి")}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HealthRequests;
