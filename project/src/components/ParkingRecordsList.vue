<script setup lang="ts">
import { ref, computed } from 'vue';
import { useParkingStore } from '../stores/parking';
import { format } from 'date-fns';
import type { ParkingRecord } from '../types';

const store = useParkingStore();
const sortField = ref<keyof ParkingRecord>('entryTime');
const sortDirection = ref<'asc' | 'desc'>('desc');

const sortedParkingRecords = computed(() => {
  const records = [...store.parkingRecords];
  
  // Separate open and closed stays
  const openStays = records.filter(record => record.exitTime === null);
  const closedStays = records.filter(record => record.exitTime !== null);
  
  // Sort both arrays
  const sortByField = (a: ParkingRecord, b: ParkingRecord) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];
    
    if (aValue === null && bValue !== null) return -1;
    if (aValue !== null && bValue === null) return 1;
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  };
  
  openStays.sort(sortByField);
  closedStays.sort(sortByField);
  
  // Always show open stays first
  return [...openStays, ...closedStays];
});

const toggleSort = (field: keyof ParkingRecord) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const getSortIcon = (field: keyof ParkingRecord) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

const getVehicleInfo = (plate: string) => {
  const vehicle = store.findVehicle(plate);
  return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.color}` : 'Veículo não encontrado';
};

const getStayStatus = (record: { exitTime: string | null }) => {
  return record.exitTime === null ? 'Em andamento' : 'Finalizada';
};
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Estadias do Dia</h2>
      <p class="text-gray-600 mt-1">
        {{ format(new Date(), "dd/MM/yyyy") }}
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th 
              @click="toggleSort('plate')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Placa {{ getSortIcon('plate') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
            <th 
              @click="toggleSort('entryTime')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Entrada {{ getSortIcon('entryTime') }}
            </th>
            <th 
              @click="toggleSort('exitTime')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Saída {{ getSortIcon('exitTime') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="record in sortedParkingRecords" :key="record.plate + record.entryTime">
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': record.exitTime === null,
                  'bg-gray-100 text-gray-800': record.exitTime !== null
                }"
              >
                {{ getStayStatus(record) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ record.plate }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ getVehicleInfo(record.plate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDateTime(record.entryTime) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ record.exitTime ? formatDateTime(record.exitTime) : '-' }}
            </td>
          </tr>
          <tr v-if="sortedParkingRecords.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Nenhuma estadia registrada hoje
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>