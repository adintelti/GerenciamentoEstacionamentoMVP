<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useParkingStore } from '../stores/parking';
import { format } from 'date-fns';

const store = useParkingStore();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredRecords = computed(() => {
  const records = [...store.parkingRecords];
  
  return records.filter(record => {
    const query = searchQuery.value.toLowerCase();
    const vehicle = store.findVehicle(record.plate);
    const vehicleInfo = vehicle 
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.color}`.toLowerCase()
      : '';
    
    return record.plate.toLowerCase().includes(query) ||
           vehicleInfo.includes(query);
  });
});

const sortedParkingRecords = computed(() => {
  // Separate open and closed stays
  const openStays = filteredRecords.value.filter(record => record.exitTime === null);
  const closedStays = filteredRecords.value.filter(record => record.exitTime !== null);
  
  // Sort both arrays by entry time
  const sortByEntryTime = (a: any, b: any) => 
    new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
  
  openStays.sort(sortByEntryTime);
  closedStays.sort(sortByEntryTime);
  
  // Concatenate arrays with open stays first
  const allRecords = [...openStays, ...closedStays];
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allRecords.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredRecords.value.length / itemsPerPage)
);

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

const changePage = (page: number) => {
  currentPage.value = page;
};

// Reset to first page when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Estadias do Dia</h2>
      <p class="text-gray-600 mt-1">
        {{ format(new Date(), "dd/MM/yyyy") }}
      </p>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Pesquisar estadias..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-4 flex justify-center space-x-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-3 py-1 rounded-md',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>