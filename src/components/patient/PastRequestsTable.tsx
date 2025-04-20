
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { HealthRequest } from "@/types";

interface PastRequestsTableProps {
  requests: HealthRequest[];
  getSymptomName: (id: string) => string;
}

const PastRequestsTable: React.FC<PastRequestsTableProps> = ({ 
  requests,
  getSymptomName,
}) => {
  const { t } = useLanguage();

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

  return (
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
              {requests.map((request) => (
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
  );
};

export default PastRequestsTable;
