export interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  color: string;
  registrationDate: string;
}

export interface ParkingRecord {
  plate: string;
  entryTime: string;
  exitTime: string | null;
}

export interface User {
  name: string;
  document: string;
  username: string;
  birthday: string;
  registrationDate: string;
  exitDate: string;
}
