
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Medicine } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedicineReminders: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medicine className="h-5 w-5" />
          {t("Medicine Reminders", "మందుల రిమైండర్లు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("Add Reminder", "రిమైండర్‌ని జోడించండి")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineReminders;
