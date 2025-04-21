
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, MapPin, Plus, FileImage } from "lucide-react";
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
  const [postalCode, setPostalCode] = useState<string>("");
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !postalCode || !prescriptionImage) {
      toast({
        title: t("Missing Information", "సమాచారం లేదు"),
        description: t("Please fill all required fields and upload prescription image", "దయచేసి అవసరమైన అన్ని ఫీల్డ్‌లను పూరించండి మరియు ప్రిస్క్రిప్షన్ ఇమేజ్‌ని అప్‌లోడ్ చేయండి"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // For demo, we just mock uploading and use a local URL
    try {
      if (currentUser) {
        const order = saveMedicineOrder({
          userId: currentUser.id,
          address: address,
          postalCode: postalCode,
          description: "", // Use empty description instead of prescriptionImageUrl
          status: "pending"
        });
        toast({
          title: t("Order Placed Successfully", "ఆర్డర్ విజయవంతంగా చేయబడింది"),
          description: t(
            `Your medicine order #${order.id} has been placed and awaiting confirmation`,
            `మీ మందుల ఆర్డర్ #${order.id} స్థాపించబడింది మరియు నిర్ధారణ కోసం వేచి ఉంది`
          ),
        });
        setAddress("");
        setPostalCode("");
        setPrescriptionImage(null);
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
            <Label htmlFor="postalCode">
              {t("Postal Code", "పోస్టల్ కోడ్")}
            </Label>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="postalCode"
                placeholder={t("Enter your postal code", "మీ పోస్టల్ కోడ్ నమోదు చేయండి")}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">
              {t("Delivery Address", "డెలివరీ చిరునామా")}
            </Label>
            <Input
              id="address"
              placeholder={t("Enter your complete address", "మీ పూర్తి చిరునామాను నమోదు చేయండి")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prescriptionImage">
              {t("Upload Doctor Prescription", "డాక్టర్ ప్రిస్క్రిప్షన్‌ను అప్‌లోడ్ చేయండి")}
            </Label>
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-gray-500" />
              <Input
                id="prescriptionImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {prescriptionImage && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(prescriptionImage)}
                  alt="Prescription Preview"
                  className="max-h-32 rounded border"
                />
              </div>
            )}
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
