
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Truck, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { countOrdersByAreaAndStatus } from "@/data/mockData";

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
  const { currentUser } = useAuth();
  const area = currentUser?.area || "";

  const pendingCount = countOrdersByAreaAndStatus(area, "pending");
  const deliveringCount = countOrdersByAreaAndStatus(area, "delivering");
  const deliveredCount = countOrdersByAreaAndStatus(area, "delivered");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon={<Package className="text-blue-500" />}
        title={t("Orders to Deliver", "డెలివరీ చేయాల్సిన ఆర్డర్లు")}
        value={pendingCount}
        description={t("Awaiting pickup", "పికప్ కోసం వేచి ఉన్నవి")}
        iconClassName="text-blue-500"
      />
      <StatsCard
        icon={<Truck className="text-yellow-500" />}
        title={t("Out for Delivery", "డెలివరీకి బయలుదేరినవి")}
        value={deliveringCount}
        description={t("Currently delivering", "ప్రస్తుతం డెలివరీ చేస్తున్నవి")}
        iconClassName="text-yellow-500"
      />
      <StatsCard
        icon={<Check className="text-green-500" />}
        title={t("Delivered Today", "ఈరోజు డెలివరీ అయినవి")}
        value={deliveredCount}
        description={t("Completed deliveries", "పూర్తి చేసిన డెలివరీలు")}
        iconClassName="text-green-500"
      />
    </div>
  );
};

export default StatsOverview;
