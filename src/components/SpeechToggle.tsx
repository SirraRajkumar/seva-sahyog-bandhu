
import React from "react";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useLanguage } from "../context/LanguageContext";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpeechToggleProps {
  text: string;
  teluguText: string;
}

const SpeechToggle: React.FC<SpeechToggleProps> = ({ text, teluguText }) => {
  const { language } = useLanguage();
  const speechText = language === "english" ? text : teluguText;
  
  const { speak, stop, isSpeaking } = useTextToSpeech({
    text: speechText,
    language: language === "english" ? "en-IN" : "te-IN",
  });

  const handleToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak();
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`rounded-full ${isSpeaking ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
      onClick={handleToggle}
    >
      {isSpeaking ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};

export default SpeechToggle;
