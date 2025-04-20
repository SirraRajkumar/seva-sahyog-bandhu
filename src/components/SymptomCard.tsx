
import React from "react";
import { Symptom } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { 
  Thermometer,
  Wind,
  Skull,
  Stethoscope,
  AlertCircle,
  ThermometerSnowflake
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
        return <Wind size={48} className="text-blue-500" />; // Wind icon to represent cough/breath
      case 'head-cough':
        return <Skull size={48} className="text-purple-500" />; // Skull to represent headache
      case 'head-cold':
        return <ThermometerSnowflake size={48} className="text-cyan-500" />; // Cold specific icon
      case 'virus':
        return <AlertCircle size={48} className="text-yellow-500" />; // Alert for stomach pain
      case 'lungs':
        return <Stethoscope size={48} className="text-green-500" />; // Breathing related
      default:
        return <AlertCircle size={48} className="text-gray-500" />;
    }
  };

  return (
    <button 
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col items-center justify-center gap-3 w-full h-full min-h-[160px]"
      onClick={onClick}
    >
      <div className="p-3 bg-gray-50 rounded-full">
        {getIcon()}
      </div>
      <p className="text-lg font-medium text-gray-800 text-center">
        {language === "english" ? symptom.name.english : symptom.name.telugu}
      </p>
    </button>
  );
};

export default SymptomCard;
