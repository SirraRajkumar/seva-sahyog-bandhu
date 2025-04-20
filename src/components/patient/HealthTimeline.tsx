
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { findRequestsByUserId } from "@/data/mockData";

interface HealthTimelineProps {
  userId: string;
}

const HealthTimeline: React.FC<HealthTimelineProps> = ({ userId }) => {
  const { t } = useLanguage();
  const requests = findRequestsByUserId(userId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("Recent Activity", "ఇటీవలి కార్యాచరణ")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
                <div className="mt-1">{getStatusIcon(request.status)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t(`Reported ${request.symptom}`, `${request.symptom} నివేదించబడింది`)}
                  </p>
                  <p className="text-xs text-gray-500">{request.date}</p>
                  <Badge variant="outline" className="mt-2">
                    {t(request.status, request.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HealthTimeline;
