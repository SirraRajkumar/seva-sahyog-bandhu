
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, File } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { findPatientsByArea, User as PatientType } from "../../data/mockData";

interface PatientsListProps {
  areaCode: string;
}

const PatientsList: React.FC<PatientsListProps> = ({ areaCode }) => {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<PatientType[]>([]);
  
  useEffect(() => {
    const areaPatients = findPatientsByArea(areaCode);
    setPatients(areaPatients);
  }, [areaCode]);
  
  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">
              {t("No Patients", "రోగులు లేరు")}
            </h3>
            <p>
              {t("No patients found in your area", "మీ ప్రాంతంలో రోగులు కనుగొనబడలేదు")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t("Patients in Your Area", "మీ ప్రాంతంలో రోగులు")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Name", "పేరు")}</TableHead>
              <TableHead>{t("Village", "గ్రామం")}</TableHead>
              <TableHead>{t("Health Card", "ఆరోగ్య కార్డ్")}</TableHead>
              <TableHead>{t("Actions", "చర్యలు")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.village}</TableCell>
                <TableCell>{patient.healthCardNumber}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <File className="h-4 w-4 mr-1" />
                    {t("View Records", "రికార్డ్‌లను వీక్షించండి")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
