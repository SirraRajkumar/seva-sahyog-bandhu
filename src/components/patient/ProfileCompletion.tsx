
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ProfileCompletion: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState({
    name: currentUser?.name || "",
    village: currentUser?.village || "",
    area: currentUser?.area || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: t("Error", "లోపం"),
        description: t("User session expired. Please login again.", "వినియోగదారు సెషన్ గడువు ముగిసింది. దయచేసి మళ్లీ లాగిన్ అవ్వండి."),
        variant: "destructive",
      });
      navigate("/patient-login");
      return;
    }
    
    if (!formData.name || !formData.village || !formData.area) {
      toast({
        title: t("Missing Information", "సమాచారం లేదు"),
        description: t("Please fill in all fields", "దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి"),
        variant: "destructive",
      });
      return;
    }
    
    // Make sure we have the user's phone number
    if (!currentUser.phone) {
      toast({
        title: t("Error", "లోపం"),
        description: t("User information is incomplete. Please login again.", "వినియోగదారు సమాచారం అసంపూర్తిగా ఉంది. దయచేసి మళ్లీ లాగిన్ అవ్వండి."),
        variant: "destructive",
      });
      navigate("/patient-login");
      return;
    }
    
    // Register updates the user with all fields
    const updatedUser = register({
      ...formData,
      phone: currentUser.phone,
    });
    
    console.log("Profile updated successfully:", updatedUser);
    
    toast({
      title: t("Profile Updated", "ప్రొఫైల్ నవీకరించబడింది"),
      description: t("Your profile has been completed", "మీ ప్రొఫైల్ పూర్తయింది"),
    });
    
    // Force a refresh of the page to ensure we load all dashboard components
    navigate("/patient-dashboard", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {t("Complete Your Profile", "మీ ప్రొఫైల్‌ని పూర్తి చేయండి")}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("Full Name", "పూర్తి పేరు")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("Enter your full name", "మీ పూర్తి పేరును నమోదు చేయండి")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village">{t("Village", "గ్రామం")}</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder={t("Enter your village name", "మీ గ్రామం పేరును నమోదు చేయండి")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">{t("Area Code", "ఏరియా కోడ్")}</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder={t("Enter your area code", "మీ ప్రాంత కోడ్‌ను నమోదు చేయండి")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {t("Complete Profile", "ప్రొఫైల్ పూర్తి చేయండి")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
