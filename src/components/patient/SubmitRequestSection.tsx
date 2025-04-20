
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import SymptomCard from "../SymptomCard";
import { Symptom } from "@/types";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SubmitRequestSectionProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onSymptomSelect: (symptomId: string) => void;
  onSubmit: () => void;
}

const SubmitRequestSection: React.FC<SubmitRequestSectionProps> = ({ 
  symptoms, 
  selectedSymptoms,
  onSymptomSelect,
  onSubmit
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("Select your Symptoms", "మీ లక్షణాలను ఎంచుకోండి")}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {symptoms.map((symptom) => (
          <SymptomCard 
            key={symptom.id}
            symptom={symptom}
            isSelected={selectedSymptoms.includes(symptom.id)}
            onClick={() => onSymptomSelect(symptom.id)}
          />
        ))}
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onSubmit}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {t(
              `Submit ${selectedSymptoms.length} Symptoms`,
              `${selectedSymptoms.length} లక్షణాలను సమర్పించండి`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubmitRequestSection;
