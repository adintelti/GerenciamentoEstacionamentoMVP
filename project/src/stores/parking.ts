import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Vehicle, ParkingRecord } from '../types';
import { format } from 'date-fns';

export const useParkingStore = defineStore('parking', () => {
  const vehicles = ref<Vehicle[]>([]);
  const parkingRecords = ref<ParkingRecord[]>([]);

  // Load data from localStorage on store initialization
  const loadData = () => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      vehicles.value = JSON.parse(savedVehicles);
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

  const registerVehicle = (vehicle: Omit<Vehicle, 'registrationDate'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      registrationDate: new Date().toISOString(),
    };
    vehicles.value.push(newVehicle);
    saveVehicles();
    return true;
  };

  const findVehicle = (plate: string) => {
    return vehicles.value.find(v => v.plate === plate);
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

  const canDeleteVehicle = (plate: string) => {
    return !parkingRecords.value.some(record => record.plate === plate);
  };

  const deleteVehicle = (plate: string) => {
    if (!canDeleteVehicle(plate)) return false;
    
    vehicles.value = vehicles.value.filter(v => v.plate !== plate);
    saveVehicles();
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
    registerVehicle,
    registerEntry,
    registerExit,
    findVehicle,
    updateVehicle,
    deleteVehicle,
    canDeleteVehicle,
  };
});