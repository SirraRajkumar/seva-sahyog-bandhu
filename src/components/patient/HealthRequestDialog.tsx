
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface HealthRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  duration: number;
  onDurationChange: (value: number[]) => void;
  onSubmit: () => void;
}

const HealthRequestDialog: React.FC<HealthRequestDialogProps> = ({
  isOpen,
  onOpenChange,
  duration,
  onDurationChange,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("How long have you been feeling this way?", "మీరు ఎంతకాలంగా ఇలా ఫీల్ అవుతున్నారు?")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Tell us how many days you've been experiencing this symptom.",
              "మీరు ఈ లక్షణాన్ని ఎన్ని రోజులుగా అనుభవిస్తున్నారో మాకు చెప్పండి."
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col items-center space-y-6">
            <span className="text-4xl font-bold text-primary">
              {duration} {t("days", "రోజులు")}
            </span>
            
            <Slider
              value={[duration]}
              min={1}
              max={30}
              step={1}
              onValueChange={onDurationChange}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("Cancel", "రద్దు చేయండి")}
          </Button>
          <Button onClick={onSubmit}>
            {t("Submit", "సమర్పించండి")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRequestDialog;
