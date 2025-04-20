
export interface User {
  id: string;
  name: string;
  phone: string;
  village: string;
  healthCardNumber: string;
  area: string;
  role: "patient" | "admin";
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

export interface Symptom {
  id: string;
  name: {
    english: string;
    telugu: string;
  };
  icon: string;
}
