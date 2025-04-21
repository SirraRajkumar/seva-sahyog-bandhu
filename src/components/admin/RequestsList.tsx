
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle, Eye } from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { findPatientsByArea, updateRequestStatus } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  patientName: string;
  village: string;
  date: string;
  status: "pending" | "urgent" | "completed";
  symptom: string;
}

const RequestsList = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      patientName: "Rajesh Kumar",
      village: "Gandipet",
      date: "2024-04-20",
      status: "urgent",
      symptom: "Fever and headache"
    },
    {
      id: "2",
      patientName: "Lakshmi Devi",
      village: "Kokapet",
      date: "2024-04-19",
      status: "pending",
      symptom: "Joint pain"
    },
    {
      id: "3",
      patientName: "Venkat Rao",
      village: "Narsingi",
      date: "2024-04-18",
      status: "completed",
      symptom: "Regular checkup"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">{t("Pending", "పెండింగ్")}</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">{t("Urgent", "అత్యవసర")}</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">{t("Completed", "పూర్తయింది")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleMarkAsCompleted = () => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, "completed");
      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id ? { ...req, status: "completed" as const } : req
      );
      setRequests(updatedRequests);
      setSelectedRequest({ ...selectedRequest, status: "completed" as const });
      toast({
        title: t("Delivery Completed", "డెలివరీ పూర్తయింది"),
        description: t(
          `${selectedRequest.patientName}'s medicine/tablet delivery marked as complete.`,
          `${selectedRequest.patientName} కి మెడిసిన్/టాబ్లెట్ డెలివరీ పూర్తయినట్లు గుర్తించబడింది.`
        ),
        variant: "default",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Patient Tablet Requests", "రోగుల టాబ్లెట్ అభ్యర్థనలు")}</CardTitle>
        <CardDescription>
          {t("Requests for tablet/medicine delivery by patients in your area", "మీ ప్రాంతంలోని రోగుల నుండి టాబ్లెట్ లేదా మెడిసిన్ డెలివరీ అభ్యర్థనలు")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{request.patientName}</h4>
                  <p className="text-sm text-gray-600">
                    {t("Village", "గ్రామం")}: {request.village}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("Symptom", "లక్షణం")}: {request.symptom}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleViewDetails(request)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  {t("View & Monitor Log", "లాగ్ ని చూడండి మరియు పర్యవేక్షించండి")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Request Details Dialog */}
        <Dialog open={selectedRequest !== null} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Patient Request Details", "రోగి అభ్యర్థన వివరాలు")}</DialogTitle>
              <DialogDescription>
                {selectedRequest && `${t("Submitted on", "సమర్పించిన తేదీ")}: ${selectedRequest.date}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      {t("Patient Name", "రోగి పేరు")}
                    </h4>
                    <p className="mt-1">{selectedRequest.patientName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      {t("Village", "గ్రామం")}
                    </h4>
                    <p className="mt-1">{selectedRequest.village}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("Reported Symptom", "నివేదించిన లక్షణం")}
                  </h4>
                  <p className="mt-1">{selectedRequest.symptom}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("Status", "స్థితి")}
                  </h4>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("Patient Log Data", "రోగి లాగ్ డేటా")}
                  </h4>
                  <p className="mt-1">
                    {t("Review patient's medicine log, reminders and previous requests for better follow-up.", "రోగి యొక్క మెడిసిన్ లాగ్, రిమైండర్లు మరియు మునుపటి అభ్యర్థనలను మరింత మంచి ఫాలో-అప్ కోసం పర్యవేక్షించండి.")}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {t("Recommended Action", "సిఫార్సు చేయబడిన చర్య")}
                  </h4>
                  <p className="mt-1">
                    {selectedRequest.status === "urgent" 
                      ? t("Immediate delivery and monitoring required", "తక్షణ డెలివరీ మరియు పర్యవేక్షణ అవసరం") 
                      : selectedRequest.status === "pending"
                      ? t("Schedule delivery and check log data", "డెలివరీ మరియు లాగ్ డేటాను చెక్ చేయండి")
                      : t("No further action required", "ఇంకా చర్య అవసరం లేదు")}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline">
                  {t("Close", "మూసివేయండి")}
                </Button>
              </DialogClose>

              {selectedRequest && selectedRequest.status !== "completed" && (
                <Button onClick={handleMarkAsCompleted}>
                  {t("Mark Delivery as Completed", "డెలివరీ పూర్తయిందిగా గుర్తించండి")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RequestsList;
