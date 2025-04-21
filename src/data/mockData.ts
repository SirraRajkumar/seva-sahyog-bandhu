import { User, HealthRequest, Symptom, MedicineOrder } from "../types";

export const users: User[] = [
  {
    id: "p1",
    name: "Rajesh Kumar",
    phone: "9876543210",
    village: "Narayanpur",
    healthCardNumber: "NHIS123456",
    area: "AP001",
    role: "patient"
  },
  {
    id: "p2",
    name: "Sita Devi",
    phone: "9876543211",
    village: "Gollapudi",
    healthCardNumber: "NHIS123457",
    area: "AP001",
    role: "patient"
  },
  {
    id: "p3",
    name: "Mohan Rao",
    phone: "9876543212",
    village: "Jangareddygudem",
    healthCardNumber: "NHIS123458",
    area: "AP002",
    role: "patient"
  },
  {
    id: "a1",
    name: "Lakshmi Reddy",
    phone: "9876543213",
    village: "Vijayawada",
    healthCardNumber: "",
    area: "AP001",
    role: "admin"
  },
  {
    id: "a2",
    name: "Priya Sharma",
    phone: "9876543214",
    village: "Rajahmundry",
    healthCardNumber: "",
    area: "AP002",
    role: "admin"
  },
  {
    id: "d1",
    name: "Dr. Suresh Kumar",
    phone: "9876543215",
    village: "Vijayawada",
    healthCardNumber: "",
    area: "AP001",
    role: "doctor"
  }
];

export const healthRequests: HealthRequest[] = [
  {
    id: "r1",
    userId: "p1",
    symptom: "fever",
    duration: 3,
    date: "2025-04-18",
    status: "pending"
  },
  {
    id: "r2",
    userId: "p2",
    symptom: "cough",
    duration: 5,
    date: "2025-04-19",
    status: "reviewed"
  },
  {
    id: "r3",
    userId: "p3",
    symptom: "headache",
    duration: 2,
    date: "2025-04-20",
    status: "urgent"
  }
];

export const medicineOrders: MedicineOrder[] = [
  {
    id: "o1",
    userId: "p1",
    address: "123 Main Street, Narayanpur, AP001",
    prescription: "Paracetamol 500mg - 10 tablets, Vitamin C 500mg - 30 tablets",
    date: "2025-04-20",
    status: "pending"
  },
  {
    id: "o2",
    userId: "p2",
    address: "45 Temple Road, Gollapudi, AP001",
    prescription: "Amoxicillin 250mg - 15 tablets, Cough syrup 100ml",
    date: "2025-04-21",
    status: "delivering"
  },
  {
    id: "o3",
    userId: "p3",
    address: "789 Market Street, Jangareddygudem, AP002",
    prescription: "Ibuprofen 400mg - 20 tablets, Montelukast 10mg - 10 tablets",
    date: "2025-04-19",
    status: "delivered"
  }
];

export const symptoms: Symptom[] = [
  {
    id: "s1",
    name: {
      english: "Fever",
      telugu: "జ్వరం"
    },
    icon: "thermometer"
  },
  {
    id: "s2",
    name: {
      english: "Cough",
      telugu: "దగ్గు"
    },
    icon: "cough"
  },
  {
    id: "s3",
    name: {
      english: "Headache",
      telugu: "తలనొప్పి"
    },
    icon: "head-cough"
  },
  {
    id: "s4",
    name: {
      english: "Cold",
      telugu: "జలుబు"
    },
    icon: "head-cold"
  },
  {
    id: "s5",
    name: {
      english: "Stomach Pain",
      telugu: "కడుపు నొప్పి"
    },
    icon: "virus"
  },
  {
    id: "s6",
    name: {
      english: "Breathing Difficulty",
      telugu: "శ్వాస సమస్య"
    },
    icon: "lungs"
  }
];

// User related functions
export function findUserByPhone(phone: string): User | undefined {
  return users.find(user => user.phone === phone);
}

export function findRequestsByUserId(userId: string): HealthRequest[] {
  return healthRequests.filter(request => request.userId === userId);
}

export function findRequestsByArea(area: string): HealthRequest[] {
  const areaUsers = users.filter(user => user.area === area && user.role === "patient");
  const userIds = areaUsers.map(user => user.id);
  return healthRequests.filter(request => userIds.includes(request.userId));
}

export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function findSymptomById(id: string): Symptom | undefined {
  return symptoms.find(symptom => symptom.id === id);
}

export function findPatientsByArea(area: string): User[] {
  return users.filter(user => user.area === area && user.role === "patient");
}

export function saveRequest(request: Omit<HealthRequest, "id" | "date" | "status">): HealthRequest {
  const newRequest = {
    ...request,
    id: `r${healthRequests.length + 1}`,
    date: new Date().toISOString().split('T')[0],
    status: "pending"
  } as HealthRequest;
  
  healthRequests.push(newRequest);
  return newRequest;
}

export function updateRequestStatus(requestId: string, newStatus: "pending" | "reviewed" | "urgent" | "completed"): HealthRequest | undefined {
  const requestIndex = healthRequests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    healthRequests[requestIndex].status = newStatus;
    return healthRequests[requestIndex];
  }
  return undefined;
}

export function saveUser(user: Omit<User, "id" | "role">): User {
  const newUser = {
    ...user,
    id: `p${users.length + 1}`,
    role: "patient"
  } as User;
  
  users.push(newUser);
  return newUser;
}

export function hasSubmittedRequestToday(userId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return healthRequests.some(request => request.userId === userId && request.date === today);
}

// Medicine Order related functions
export function findOrdersByUserId(userId: string): MedicineOrder[] {
  return medicineOrders.filter(order => order.userId === userId);
}

export function findOrdersByArea(area: string): MedicineOrder[] {
  const areaUsers = users.filter(user => user.area === area && user.role === "patient");
  const userIds = areaUsers.map(user => user.id);
  return medicineOrders.filter(order => userIds.includes(order.userId));
}

export function saveMedicineOrder(order: Omit<MedicineOrder, "id" | "date">): MedicineOrder {
  const newOrder = {
    ...order,
    id: `o${medicineOrders.length + 1}`,
    date: new Date().toISOString().split('T')[0],
  } as MedicineOrder;
  
  medicineOrders.push(newOrder);
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: "pending" | "confirmed" | "delivering" | "delivered"): MedicineOrder | undefined {
  const orderIndex = medicineOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    medicineOrders[orderIndex].status = newStatus;
    return medicineOrders[orderIndex];
  }
  return undefined;
}

export function countOrdersByAreaAndStatus(area: string, status: string): number {
  const orders = findOrdersByArea(area);
  return orders.filter(order => order.status === status).length;
}
