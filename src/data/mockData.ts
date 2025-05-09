import { User, HealthRequest, Symptom, MedicineOrder } from "../types";

export const users: User[] = [
  // === DEFAULT LOGIN DETAILS ===
  // Patient: ID = p1, Phone = 9876543210
  {
    id: "p1",
    name: "Rajesh Kumar",
    phone: "9876543210",
    village: "Narayanpur",
    area: "", // area removed, kept empty for compatibility
    role: "patient"
  },
  // Patient: ID = p2, Phone = 9876543211
  {
    id: "p2",
    name: "Sita Devi",
    phone: "9876543211",
    village: "Gollapudi",
    area: "",
    role: "patient"
  },
  // Patient: ID = p3, Phone = 9876543212
  {
    id: "p3",
    name: "Mohan Rao",
    phone: "9876543212",
    village: "Jangareddygudem",
    area: "",
    role: "patient"
  },
  // Delivery Partner: ID = a1, Phone = 9876543213
  {
    id: "a1",
    name: "Lakshmi Reddy",
    phone: "9876543213",
    village: "Vijayawada",
    area: "",
    role: "admin"
  },
  // Delivery Partner: ID = a2, Phone = 9876543214
  {
    id: "a2",
    name: "Priya Sharma",
    phone: "9876543214",
    village: "Rajahmundry",
    area: "",
    role: "admin"
  },
  // Doctor: ID = d1, Phone = 9876543215
  {
    id: "d1",
    name: "Dr. Suresh Kumar",
    phone: "9876543215",
    village: "Vijayawada",
    area: "",
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
    postalCode: "500001",
    description: "",
    date: "2025-04-20",
    status: "pending"
  },
  {
    id: "o2",
    userId: "p2",
    address: "45 Temple Road, Gollapudi, AP001",
    postalCode: "500002",
    description: "",
    date: "2025-04-21",
    status: "delivering"
  },
  {
    id: "o3",
    userId: "p3",
    address: "789 Market Street, Jangareddygudem, AP002",
    postalCode: "500003",
    description: "",
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

// Helper to generate unique patient ID
function generatePatientId(): string {
  const maxPID = users
    .filter((user) => user.id.startsWith("p"))
    .map((user) => parseInt(user.id.replace("p", ""), 10))
    .reduce((max, n) => (Number.isNaN(n) ? max : Math.max(max, n)), 0);
  return `p${maxPID + 1}`;
}

// User related functions
export function findUserByIdentifier(identifier: string): User | undefined {
  // identifier can be phone or id
  return users.find(user => user.phone === identifier || user.id === identifier);
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
  // Generate a unique patient ID
  const newId = generatePatientId();
  const newUser = {
    ...user,
    id: newId,
    area: "", // area always empty/removed for new users
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

// Add order with description (doctor-provided medicines)
export function saveMedicineOrder(order: Omit<MedicineOrder, "id" | "date">): MedicineOrder {
  const newOrder = {
    ...order,
    id: `o${medicineOrders.length + 1}`,
    date: new Date().toISOString().split('T')[0],
  } as MedicineOrder;
  
  medicineOrders.push(newOrder);
  return newOrder;
}

// Add function to get patient's address and postalCode by user id
export function getPatientAddressAndPostalCode(userId: string): { address: string, postalCode: string } {
  const user = users.find(u => u.id === userId);
  if (!user) return { address: "", postalCode: "" };
  // For demo, default basic address fields
  return {
    address: `${user.village}, ${user.area}`,
    postalCode: "500000"
  };
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
