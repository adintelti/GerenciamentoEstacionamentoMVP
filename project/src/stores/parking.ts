import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Vehicle, ParkingRecord, User } from '../types';
import { format } from 'date-fns';

export const useParkingStore = defineStore('parking', () => {
  const vehicles = ref<Vehicle[]>([]);
  const parkingRecords = ref<ParkingRecord[]>([]);
  const users = ref<User[]>([]);

  // Load data from localStorage on store initialization
  const loadData = () => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      vehicles.value = JSON.parse(savedVehicles);
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      users.value = JSON.parse(savedUsers);
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const savedRecords = localStorage.getItem(`parking-${today}`);
    if (savedRecords) {
      parkingRecords.value = JSON.parse(savedRecords);
    }
  };

  // Save vehicles to localStorage
  const saveVehicles = () => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles.value));
  };

  // Save parking records to localStorage
  const saveParkingRecords = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`parking-${today}`, JSON.stringify(parkingRecords.value));
  };

  // Save users to localStorage
  const saveUsers = () => {
    localStorage.setItem('users', JSON.stringify(users.value));
  };

  const registerVehicle = (vehicle: Omit<Vehicle, 'registrationDate'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      registrationDate: new Date().toISOString(),
    };
    vehicles.value.push(newVehicle);
    saveVehicles();
    return true;
  };

  function converterParaISO(dataBr: string) {
    const [dia, mes, ano] = dataBr.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.toISOString();
}

  const registerUser = (user: Omit<User, 'registrationDate'>) => {
    const newUser: User = {
      ...user,
      registrationDate: new Date().toISOString(),
      birthday: converterParaISO(user.birthday),
      exitDate: user.exitDate ? converterParaISO(user.birthday) : '',
    };
    users.value.push(newUser);
    saveUsers();
    return true;
  };

  const findVehicle = (plate: string) => {
    return vehicles.value.find(v => v.plate === plate);
  };

  const findUser = (document: string) => {
    return users.value.find(u => u.document === document);
  };

  const updateVehicle = (originalPlate: string, updatedVehicle: Omit<Vehicle, 'registrationDate'>) => {
    const index = vehicles.value.findIndex(v => v.plate === originalPlate);
    if (index === -1) return false;

    const originalVehicle = vehicles.value[index];
    vehicles.value[index] = {
      ...updatedVehicle,
      registrationDate: originalVehicle.registrationDate,
    };
    saveVehicles();
    return true;
  };

  const updateUser = (originalDocument: string, updatedUser: Omit<User, 'registrationDate'>) => {
    const index = users.value.findIndex(v => v.document === originalDocument);
    if (index === -1) return false;

    const originalUser = users.value[index];
    users.value[index] = {
      ...updatedUser,
      registrationDate: originalUser.registrationDate,
      birthday: converterParaISO(updatedUser.birthday),
      exitDate: updatedUser.exitDate ? converterParaISO(updatedUser.exitDate) : '',
    };
    saveUsers();
    return true;
  };

  const canDeleteVehicle = (plate: string) => {
    return !parkingRecords.value.some(record => record.plate === plate);
  };

  const canDeleteUser = (document: string) => {
    return !parkingRecords.value.some(record => record.plate === document);
  };

  const deleteVehicle = (plate: string) => {
    if (!canDeleteVehicle(plate)) return false;
    
    vehicles.value = vehicles.value.filter(v => v.plate !== plate);
    saveVehicles();
    return true;
  };

  const deleteUser = (document: string) => {
    if (!canDeleteUser(document)) return false;
    
    users.value = users.value.filter(u => u.document !== document);
    saveUsers();
    return true;
  };

  const registerEntry = (plate: string) => {
    const vehicle = findVehicle(plate);
    if (!vehicle) {
      return { success: false, message: 'Veículo/placa não encontrada.' };
    }

    const existingRecord = parkingRecords.value.find(
      r => r.plate === plate && r.exitTime === null
    );
    if (existingRecord) {
      return { success: false, message: 'Veículo já está no estacionamento.' };
    }

    const newRecord: ParkingRecord = {
      plate,
      entryTime: new Date().toISOString(),
      exitTime: null,
    };
    parkingRecords.value.push(newRecord);
    saveParkingRecords();
    return { success: true, message: 'Entrada registrada com sucesso.' };
  };

  const registerExit = (plate: string) => {
    const record = parkingRecords.value.find(
      r => r.plate === plate && r.exitTime === null
    );
    if (!record) {
      return { 
        success: false, 
        message: 'Entrada do veículo não encontrada, veículo pode não estar no estacionamento.' 
      };
    }

    record.exitTime = new Date().toISOString();
    saveParkingRecords();
    return { success: true, message: 'Obrigado pela estadia conosco.' };
  };

  // Initialize store
  loadData();

  return {
    vehicles,
    parkingRecords,
    users,
    registerVehicle,
    registerEntry,
    registerExit,
    registerUser,
    findVehicle,
    findUser,
    updateVehicle,
    updateUser,
    deleteVehicle,
    deleteUser,
    canDeleteVehicle,
    canDeleteUser,
  };
});