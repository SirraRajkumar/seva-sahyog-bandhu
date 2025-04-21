
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, MapPin, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { saveMedicineOrder } from "../../data/mockData";

interface MedicineOrderProps {
  onOrderPlaced: () => void;
}

const MedicineOrderSection: React.FC<MedicineOrderProps> = ({ onOrderPlaced }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [address, setAddress] = useState<string>("");
  const [prescriptionDetails, setPrescriptionDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !prescriptionDetails) {
      toast({
        title: t("Missing Information", "సమాచారం లేదు"),
        description: t("Please fill all required fields", "దయచేసి అవసరమైన అన్ని ఫీల్డ్‌లను పూరించండి"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save order to our mock database
      if (currentUser) {
        const order = saveMedicineOrder({
          userId: currentUser.id,
          address: address,
          prescription: prescriptionDetails,
          status: "pending"
        });
        
        toast({
          title: t("Order Placed Successfully", "ఆర్డర్ విజయవంతంగా చేయబడింది"),
          description: t(
            `Your medicine order #${order.id} has been placed and awaiting confirmation`,
            `మీ మందుల ఆర్డర్ #${order.id} స్థాపించబడింది మరియు నిర్ధారణ కోసం వేచి ఉంది`
          ),
        });
        
        // Reset form
        setAddress("");
        setPrescriptionDetails("");
        
        // Notify parent component
        onOrderPlaced();
      }
    } catch (error) {
      toast({
        title: t("Order Failed", "ఆర్డర్ విఫలమైంది"),
        description: t("Unable to place your order. Please try again.", "మీ ఆర్డర్‌ను ప్లేస్ చేయడం సాధ్యం కాదు. దయచేసి మళ్లీ ప్రయత్నించండి."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t("Order Medicine", "మందులను ఆర్డర్ చేయండి")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              {t("Delivery Address", "డెలివరీ చిరునామా")}
            </Label>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="address"
                placeholder={t(
                  "Enter your complete address",
                  "మీ పూర్తి చిరునామాను నమోదు చేయండి"
                )}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prescription">
              {t("Prescription Details", "ప్రిస్క్రిప్షన్ వివరాలు")}
            </Label>
            <Textarea
              id="prescription"
              placeholder={t(
                "List medications as prescribed by your doctor",
                "మీ వైద్యుడు సూచించిన మందులను జాబితా చేయండి"
              )}
              value={prescriptionDetails}
              onChange={(e) => setPrescriptionDetails(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Place Order", "ఆర్డర్ చేయండి")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicineOrderSection;
