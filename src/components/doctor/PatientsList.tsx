import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { findPatientsByArea } from "../../data/mockData";
import { User } from "../../types";

const PatientsList: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      const areaPatients = findPatientsByArea(currentUser.area);
      setPatients(areaPatients);
    }
  }, [currentUser]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Patients List", "రోగుల జాబితా")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="search"
          placeholder={t("Search patients...", "రోగుల కోసం వెతకండి...")}
          value={search}
          onChange={handleSearch}
          className="mb-4"
        />
        <div className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="py-2">
              <p className="text-sm font-medium">{patient.name}</p>
              <p className="text-xs text-gray-500">{patient.phone}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
