<script setup lang="ts">
import { computed } from 'vue';
import { useParkingStore } from '../stores/parking';
import { format } from 'date-fns';

const store = useParkingStore();

const sortedParkingRecords = computed(() => {
  const records = [...store.parkingRecords];
  
  // Separate open and closed stays
  const openStays = records.filter(record => record.exitTime === null);
  const closedStays = records.filter(record => record.exitTime !== null);
  
  // Sort both arrays by entry time
  const sortByEntryTime = (a: any, b: any) => 
    new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
  
  openStays.sort(sortByEntryTime);
  closedStays.sort(sortByEntryTime);
  
  // Concatenate arrays with open stays first
  return [...openStays, ...closedStays];
});

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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saída</th>
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