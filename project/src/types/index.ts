export interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  color: string;
  createdAt: string;
}

export interface ParkingRecord {
  plate: string;
  entryTime: string;
  exitTime: string | null;
}

export interface User {
  id: string | null;
  name: string;
  document: string;
  birthday: string | null;
  email: string;
  password: string | null;
  createdAt: string;
  exitDate: string | null;
}
