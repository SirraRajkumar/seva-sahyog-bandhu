
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
      className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 
                hover:shadow-xl hover:scale-105 border border-gray-100 flex flex-col items-center justify-center 
                gap-4 w-full h-full min-h-[200px]"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-full 
                      shadow-inner group-hover:shadow-md transition-all duration-300">
          {getIcon()}
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-gray-800 text-center transition-colors 
                      group-hover:text-primary">
            {language === "english" ? symptom.name.english : symptom.name.telugu}
          </p>
          
          <p className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 
                      transition-all duration-300 text-center">
            {language === "english" ? "Click to select" : "ఎంచుకోవడానికి క్లిక్ చేయండి"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default SymptomCard;
