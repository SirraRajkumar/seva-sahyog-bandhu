
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const HealthTips: React.FC = () => {
  const { t, language } = useLanguage();

  const tips = [
    {
      english: "Stay hydrated by drinking at least 8 glasses of water daily",
      telugu: "రోజుకి కనీసం 8 గ్లాసుల నీరు త్రాగడం ద్వారా హైడ్రేటెడ్‌గా ఉండండి"
    },
    {
      english: "Exercise for at least 30 minutes every day",
      telugu: "ప్రతిరోజూ కనీసం 30 నిమిషాలు వ్యాయామం చేయండి"
    },
    {
      english: "Get 7-8 hours of sleep each night",
      telugu: "ప్రతి రాత్రి 7-8 గంటల నిద్ర పొందండి"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          {t("Health Tips", "ఆరోగ్య చిట్కాలు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p className="text-sm">
                {language === "english" ? tip.english : tip.telugu}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTips;
