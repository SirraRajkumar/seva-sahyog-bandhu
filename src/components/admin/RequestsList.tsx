
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

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

  const requests: Request[] = [
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
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Recent Health Requests", "ఇటీవలి ఆరోగ్య అభ్యర్థనలు")}</CardTitle>
        <CardDescription>
          {t("Latest health requests from patients in your area", "మీ ప్రాంతంలోని రోగుల నుండి తాజా ఆరోగ్య అభ్యర్థనలు")}
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
                <Button size="sm" variant="outline">
                  {t("View Details", "వివరాలను చూడండి")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsList;
