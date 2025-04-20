
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MedicineReminder {
  id: string;
  name: string;
  time: string;
  completed: boolean;
}

const MedicineReminders: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [reminders, setReminders] = useState<MedicineReminder[]>([
    { id: "1", name: "Paracetamol", time: "08:00", completed: false },
    { id: "2", name: "Vitamin C", time: "12:30", completed: false },
    { id: "3", name: "Calcium", time: "20:00", completed: false },
  ]);

  const toggleCompleted = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed } 
        : reminder
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          {t("Medicine Reminders", "మందుల రిమైండర్లు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
          <CollapsibleTrigger className="w-full text-left flex justify-between items-center text-sm text-muted-foreground mb-2">
            {isOpen ? t("Hide Reminders", "రిమైండర్లను దాచండి") : t("Show Reminders", "రిమైండర్లను చూపించు")}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      reminder.completed ? "bg-muted/50" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`reminder-${reminder.id}`}
                        checked={reminder.completed}
                        onCheckedChange={() => toggleCompleted(reminder.id)}
                      />
                      <div className={`${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                        <p className="text-sm font-medium">{reminder.name}</p>
                        <p className="text-xs text-muted-foreground">{reminder.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                {t("No medicine reminders set", "మందుల రిమైండర్లు ఏవీ సెట్ చేయబడలేదు")}
              </p>
            )}
          </CollapsibleContent>
          
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("Add Reminder", "రిమైండర్‌ని జోడించండి")}
          </Button>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default MedicineReminders;
