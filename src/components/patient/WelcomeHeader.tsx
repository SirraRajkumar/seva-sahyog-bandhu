
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WelcomeHeaderProps {
  name: string;
  alreadySubmitted: boolean;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ name, alreadySubmitted }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t("Hello", "హలో")}, {name}
      </h1>
      <p className="text-gray-600">
        {t(
          "How are you feeling today?",
          "మీరు ఈరోజు ఎలా ఫీల్ అవుతున్నారు?"
        )}
      </p>
      
      {alreadySubmitted && (
        <Alert className="mt-4">
          <AlertDescription className="text-blue-700">
            {t(
              "You've already submitted a health request today. An ASHA worker will contact you soon.",
              "మీరు ఇప్పటికే ఈరోజు ఆరోగ్య అభ్యర్థనను సమర్పించారు. ASHA కార్యకర్త త్వరలో మిమ్మల్ని సంప్రదిస్తారు."
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WelcomeHeader;
