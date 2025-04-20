
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import SymptomCard from "../SymptomCard";
import { Symptom } from "@/types";

interface SubmitRequestSectionProps {
  symptoms: Symptom[];
  onSymptomSelect: (symptomId: string) => void;
}

const SubmitRequestSection: React.FC<SubmitRequestSectionProps> = ({ 
  symptoms, 
  onSymptomSelect 
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("Select a Symptom", "లక్షణాన్ని ఎంచుకోండి")}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {symptoms.map((symptom) => (
          <SymptomCard 
            key={symptom.id}
            symptom={symptom}
            onClick={() => onSymptomSelect(symptom.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubmitRequestSection;
