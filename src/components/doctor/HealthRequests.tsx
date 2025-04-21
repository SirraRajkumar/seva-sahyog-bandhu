
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  findRequestsByArea,
  findUserById,
  findSymptomById,
  updateRequestStatus,
  healthRequests,
} from "../../data/mockData";
import { HealthRequest } from "../../types";

const HealthRequests: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [requests, setRequests] = useState<HealthRequest[]>([]);

  React.useEffect(() => {
    if (currentUser) {
      const areaRequests = findRequestsByArea(currentUser.area);
      setRequests(areaRequests);
    }
  }, [currentUser]);

  const handleStatusChange = (requestId: string, status: "pending" | "reviewed" | "urgent" | "completed") => {
    const updated = updateRequestStatus(requestId, status);
    if (updated) {
      toast({
        title: t("Status Updated", "స్థితి నవీకరించబడింది"),
        description: t("Request status has been updated.", "అభ్యర్థన స్థితి నవీకరించబడింది."),
      });

      // Update local state
      setRequests(requests.map(req => req.id === requestId ? {...req, status} : req));
    }
  };

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(req => req.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">{t("Pending", "పెండింగ్")}</Badge>;
      case "reviewed":
        return <Badge variant="default">{t("Reviewed", "సమీక్షించబడింది")}</Badge>;
      case "urgent":
        return <Badge variant="destructive">{t("Urgent", "అత్యవసరం")}</Badge>;
      case "completed":
        return <Badge variant="outline">{t("Completed", "పూర్తయింది")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Health Requests", "ఆరోగ్య అభ్యర్థనలు")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Filter by Status", "స్థితి ద్వారా ఫిల్టర్ చేయండి")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All", "అన్నీ")}</SelectItem>
              <SelectItem value="pending">{t("Pending", "పెండింగ్")}</SelectItem>
              <SelectItem value="reviewed">{t("Reviewed", "సమీక్షించబడింది")}</SelectItem>
              <SelectItem value="urgent">{t("Urgent", "అత్యవసరం")}</SelectItem>
              <SelectItem value="completed">{t("Completed", "పూర్తయింది")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => {
            const user = findUserById(request.userId);
            const symptom = findSymptomById(request.symptom);

            return (
              <div key={request.id} className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {t("Phone", "ఫోన్")}: {user?.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("Village", "గ్రామం")}: {user?.village}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{t("Symptom", "లక్షణం")}:</span>{" "}
                      {symptom?.name[language]} ({symptom?.name.english})
                    </p>
                    <p>
                      <span className="font-medium">{t("Duration", "వ్యవధి")}:</span> {request.duration} {t("days", "రోజులు")}
                    </p>
                    <p>
                      <span className="font-medium">{t("Date", "తేదీ")}:</span> {request.date}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Select onValueChange={(value) => handleStatusChange(request.id, value as "pending" | "reviewed" | "urgent" | "completed")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("Update Status", "స్థితిని నవీకరించండి")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t("Pending", "పెండింగ్")}</SelectItem>
                      <SelectItem value="reviewed">{t("Reviewed", "సమీక్షించబడింది")}</SelectItem>
                      <SelectItem value="urgent">{t("Urgent", "అత్యవసరం")}</SelectItem>
                      <SelectItem value="completed">{t("Completed", "పూర్తయింది")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRequests;
