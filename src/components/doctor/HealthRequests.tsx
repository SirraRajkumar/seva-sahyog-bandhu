
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
  saveMedicineOrder,
  getPatientAddressAndPostalCode,
} from "../../data/mockData";
import { HealthRequest } from "../../types";

const HealthRequests: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [requests, setRequests] = useState<HealthRequest[]>([]);
  // New: Track medicine input per request
  const [medicines, setMedicines] = useState<{ [rid: string]: string }>({});

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

      setRequests(requests.map(req => req.id === requestId ? {...req, status} : req));
    }
  };

  // When doctor submits medicine for symptom, create order for patient
  const handleSubmitMedicine = (request: HealthRequest) => {
    if (!medicines[request.id] || !currentUser) {
      toast({
        title: t("Provide medicine", "మందులు ఇవ్వండి"),
        description: t("Please enter medicines to give to the patient.", "దయచేసి రోగికి ఇవ్వాల్సిన మందులు నమోదు చేయండి."),
        variant: "destructive",
      });
      return;
    }
    const user = findUserById(request.userId);
    if (!user) return;
    const { address, postalCode } = getPatientAddressAndPostalCode(user.id);

    saveMedicineOrder({
      userId: user.id,
      address,
      postalCode,
      description: medicines[request.id],
      status: "pending",
    });

    toast({
      title: t("Medicines sent", "మందులు పంపబడినవి"),
      description: t("Medicines have been prescribed and an order placed for the patient.", "మందులు సూచించబడి, ఆర్డర్ రోగికి చేయబడింది."),
    });

    // Optionally, mark request as reviewed
    handleStatusChange(request.id, "reviewed");
    setMedicines({ ...medicines, [request.id]: "" });
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
                {/* Doctor inputs recommended medicines */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    type="text"
                    className="border rounded px-3 py-2 flex-1"
                    placeholder={t("Enter medicines as comma separated", "మందులను కామాతో వేరు చేసి నమోదు చేయండి")}
                    value={medicines[request.id] || ""}
                    onChange={e =>
                      setMedicines({ ...medicines, [request.id]: e.target.value })
                    }
                  />
                  <Button
                    className="mt-2 md:mt-0"
                    onClick={() => handleSubmitMedicine(request)}
                  >
                    {t("Send Medicines", "మందులు పంపించండి")}
                  </Button>
                  <div className="flex-1" />
                  <Select
                    onValueChange={value =>
                      handleStatusChange(
                        request.id,
                        value as "pending" | "reviewed" | "urgent" | "completed"
                      )
                    }
                  >
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
