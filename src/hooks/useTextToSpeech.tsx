
import { useState, useEffect } from "react";

interface UseTextToSpeechProps {
  text: string;
  language: "en-IN" | "te-IN"; // English (India) or Telugu
  autoSpeak?: boolean;
}

export function useTextToSpeech({ text, language, autoSpeak = false }: UseTextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    newUtterance.lang = language;
    
    // Set voice (try to use a female voice if available)
    const voices = synth.getVoices();
    const voiceForLanguage = voices.find(
      (voice) => voice.lang === language && voice.name.includes('Female')
    );
    
    if (voiceForLanguage) {
      newUtterance.voice = voiceForLanguage;
    }
    
    // Set other properties
    newUtterance.rate = 0.9; // Slightly slower for clarity
    newUtterance.pitch = 1.1; // Slightly higher pitch
    
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onpause = () => setIsPaused(true);
    newUtterance.onresume = () => setIsPaused(false);
    
    setUtterance(newUtterance);
    
    return () => {
      synth.cancel();
    };
  }, [text, language]);

  // Auto speak when component mounts if autoSpeak is true
  useEffect(() => {
    if (autoSpeak && utterance) {
      speak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpeak, utterance]);

  const speak = () => {
    if (!utterance) return;
    
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any ongoing speech
    synth.speak(utterance);
  };

  const pause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
  };

  const resume = () => {
    const synth = window.speechSynthesis;
    synth.resume();
  };

  const stop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
  };
}
