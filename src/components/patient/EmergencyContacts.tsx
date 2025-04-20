
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmergencyContacts: React.FC = () => {
  const { t } = useLanguage();

  const emergencyNumbers = [
    { name: "ASHA Worker", number: "108" },
    { name: "Ambulance", number: "102" },
    { name: "Emergency", number: "112" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          {t("Emergency Contacts", "అత్యవసర సంప్రదింపులు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyNumbers.map((contact) => (
            <Button
              key={contact.number}
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => window.location.href = `tel:${contact.number}`}
            >
              <Phone className="h-4 w-4" />
              <span className="flex-1">{t(contact.name, contact.name)}</span>
              <span className="font-mono">{contact.number}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
