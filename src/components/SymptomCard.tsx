
import React from "react";
import { Symptom } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { 
  Thermometer, 
  Pill,
  Droplets, 
  Bug, 
  Lung, // Corrected to 'Lung'
  Droplet
} from "lucide-react";

interface SymptomCardProps {
  symptom: Symptom;
  onClick: () => void;
}

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, onClick }) => {
  const { language } = useLanguage();
  
  const getIcon = () => {
    switch (symptom.icon) {
      case 'thermometer':
        return <Thermometer size={48} className="text-red-500" />;
      case 'cough':
        return <Droplets size={48} className="text-orange-500" />;
      case 'head-cough':
        return <Pill size={48} className="text-purple-500" />;
      case 'virus':
        return <Bug size={48} className="text-green-500" />;
      case 'lungs':
        return <Lung size={48} className="text-blue-500" />; // Updated to use 'Lung'
      case 'head-cold':
        return <Droplet size={48} className="text-cyan-500" />;
      default:
        return <Bug size={48} className="text-gray-500" />;
    }
  };

  return (
    <button 
      className="symptom-card w-full h-full"
      onClick={onClick}
    >
      <div className="mb-3">{getIcon()}</div>
      <p className="text-lg font-medium text-gray-800">
        {language === "english" ? symptom.name.english : symptom.name.telugu}
      </p>
    </button>
  );
};

export default SymptomCard;
