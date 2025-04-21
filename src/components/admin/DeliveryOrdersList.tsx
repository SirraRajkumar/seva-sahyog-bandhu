
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  Check, 
  MapPin, 
  User,
  Navigation
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { findOrdersByArea, updateOrderStatus, findUserById } from "../../data/mockData";

interface DeliveryOrdersListProps {
  status: "pending" | "delivering" | "delivered";
  currentArea: string;
}

const DeliveryOrdersList: React.FC<DeliveryOrdersListProps> = ({ status, currentArea }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const areaOrders = findOrdersByArea(currentArea).filter(
      order => order.status === status
    );
    setOrders(areaOrders);
  }, [currentArea, status]);
  
  const handleUpdateStatus = (orderId: string, newStatus: "confirmed" | "delivering" | "delivered") => {
    const updatedOrder = updateOrderStatus(orderId, newStatus);
    
    if (updatedOrder) {
      toast({
        title: t("Order Updated", "ఆర్డర్ నవీకరించబడింది"),
        description: t(
          `Order #${orderId} status updated to ${newStatus}`,
          `ఆర్డర్ #${orderId} స్థితి ${newStatus}కి నవీకరించబడింది`
        )
      });
      
      // Update local orders list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }
  };
  
  const getActionButton = (order: any) => {
    switch (status) {
      case "pending":
        return (
          <Button 
            className="w-full mt-4"
            onClick={() => handleUpdateStatus(order.id, "delivering")}
          >
            <Truck className="mr-2 h-4 w-4" />
            {t("Start Delivery", "డెలివరీ ప్రారంభించండి")}
          </Button>
        );
      case "delivering":
        return (
          <Button 
            className="w-full mt-4"
            onClick={() => handleUpdateStatus(order.id, "delivered")}
          >
            <Check className="mr-2 h-4 w-4" />
            {t("Mark as Delivered", "డెలివరీ అయినట్లు గుర్తించండి")}
          </Button>
        );
      default:
        return null;
    }
  };
  
  const getPatientName = (userId: string) => {
    const user = findUserById(userId);
    return user ? user.name : "Unknown Patient";
  };
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">
              {t("No Orders", "ఆర్డర్లు లేవు")}
            </h3>
            <p>
              {status === "pending" 
                ? t("No pending orders in your area", "మీ ప్రాంతంలో పెండింగ్ ఆర్డర్లు లేవు")
                : status === "delivering"
                ? t("No orders out for delivery", "డెలివరీకి బయలుదేరిన ఆర్డర్లు లేవు")
                : t("No delivered orders", "డెలివరీ చేసిన ఆర్డర్లు లేవు")
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map(order => (
        <Card key={order.id} className="overflow-hidden">
          <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
            <span className="font-medium">
              {t("Order #", "ఆర్డర్ #")}{order.id}
            </span>
            <Badge variant="secondary">
              {status === "pending" 
                ? t("Pending", "పెండింగ్")
                : status === "delivering"
                ? t("Delivering", "డెలివరీ చేస్తోంది")
                : t("Delivered", "డెలివరీ అయినది")
              }
            </Badge>
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">{getPatientName(order.userId)}</p>
                <p className="text-sm text-gray-500">{t("Patient", "రోగి")}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="break-words">{order.address}</p>
                <p className="text-sm text-gray-500">{t("Delivery Address", "డెలివరీ చిరునామా")}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="break-words">{order.prescription}</p>
                <p className="text-sm text-gray-500">{t("Medicines", "మందులు")}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full mb-2" 
                onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(order.address)}`, '_blank')}
              >
                <Navigation className="mr-2 h-4 w-4" />
                {t("Navigate", "నావిగేట్ చేయండి")}
              </Button>
              
              {getActionButton(order)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryOrdersList;
