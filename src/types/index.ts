
export interface User {
  id: string;
  name: string;
  phone: string;
  village: string;
  // Removed healthCardNumber
  area: string;
  role: "patient" | "admin" | "doctor";
  requests?: HealthRequest[];
}

export interface HealthRequest {
  id: string;
  userId: string;
  symptom: string;
  duration: number;
  date: string;
  status: "pending" | "reviewed" | "urgent" | "completed";
}

export interface MedicineOrder {
  id: string;
  userId: string;
  address: string;
  postalCode: string;
  description: string; // Medicinal description provided by doctor
  date: string;
  status: "pending" | "confirmed" | "delivering" | "delivered";
}

export interface Symptom {
  id: string;
  name: {
    english: string;
    telugu: string;
  };
  icon: string;
}
