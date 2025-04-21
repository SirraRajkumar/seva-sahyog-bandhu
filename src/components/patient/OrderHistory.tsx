
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { findOrdersByUserId, MedicineOrder } from "../../data/mockData";

const OrderHistory: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<MedicineOrder[]>([]);

  useEffect(() => {
    if (currentUser) {
      const userOrders = findOrdersByUserId(currentUser.id);
      setOrders(userOrders);
    }
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">{t("Pending", "పెండింగ్")}</Badge>;
      case "confirmed":
        return <Badge variant="primary">{t("Confirmed", "నిర్ధారించబడింది")}</Badge>;
      case "delivering":
        return <Badge variant="warning">{t("Out for Delivery", "డెలివరీ కోసం బయలుదేరింది")}</Badge>;
      case "delivered":
        return <Badge variant="success">{t("Delivered", "డెలివరీ చేయబడింది")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t("Your Medicine Orders", "మీ మందుల ఆర్డర్లు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {t("Order #", "ఆర్డర్ #")}{order.id}
                </h3>
                {getStatusBadge(order.status)}
              </div>
              
              <p className="text-sm text-gray-500">
                {t("Ordered on", "ఆర్డర్ చేసిన తేదీ")}: {order.date}
              </p>
              
              <p className="text-sm break-words">
                <span className="font-medium">{t("Medicines", "మందులు")}: </span>
                {order.prescription}
              </p>
              
              <div className="flex items-center text-sm text-gray-600">
                {order.status === "delivering" ? (
                  <Truck className="h-4 w-4 mr-1 text-primary" />
                ) : order.status === "delivered" ? (
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Package className="h-4 w-4 mr-1" />
                )}
                <p>{order.address}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
