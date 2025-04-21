
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Clock, AlertCircle } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, description, iconClassName }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <div className={`h-8 w-8 mr-3 ${iconClassName}`}>
          {icon}
        </div>
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </CardContent>
  </Card>
);

const StatsOverview = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon={<UserCircle className="text-blue-500" />}
        title={t("Patients", "రోగులు")}
        value={24}
        description={t("Total in your area", "మీ ప్రాంతంలో మొత్తం")}
        iconClassName="text-blue-500"
      />
      <StatsCard
        icon={<Clock className="text-yellow-500" />}
        title={t("Tablets to Deliver", "డెలివరీ చేయాల్సిన టాబ్లెట్లు")}
        value={8}
        description={t("Need attention", "దృష్టి అవసరం")}
        iconClassName="text-yellow-500"
      />
      <StatsCard
        icon={<AlertCircle className="text-red-500" />}
        title={t("Logs to Monitor", "పర్యవేక్షించాల్సిన లాగ్స్")}
        value={3}
        description={t("High priority", "అధిక ప్రాధాన్యత")}
        iconClassName="text-red-500"
      />
    </div>
  );
};

export default StatsOverview;
