<script setup lang="ts">
import { ref, computed } from 'vue';
import { useParkingStore } from '../stores/parking';
import { useRouter } from 'vue-router';
import type { Vehicle } from '../types';

const store = useParkingStore();
const router = useRouter();
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const sortField = ref<keyof Vehicle>('registrationDate');
const sortDirection = ref<'asc' | 'desc'>('desc');
const searchQuery = ref('');

const vehicles = computed(() => {
  if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return store.vehicles.filter(vehicle => 
      vehicle.plate.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.color.toLowerCase().includes(query)
    );
  }

  const sorted = [...store.vehicles].sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
});

const toggleSort = (field: keyof Vehicle) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const getSortIcon = (field: keyof Vehicle) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const deleteVehicle = (plate: string) => {
  const canDelete = store.canDeleteVehicle(plate);
  if (!canDelete) {
    message.value = 'Não é possível excluir um veículo com estadias no dia atual.';
    messageType.value = 'error';
    return;
  }

  store.deleteVehicle(plate);
  message.value = 'Veículo excluído com sucesso.';
  messageType.value = 'success';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

const navigateToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Lista de Veículos</h2>
      <button
        @click="navigateToRegister"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Novo Veículo
      </button>
    </div>

    <div v-if="message" class="mb-4 p-4 rounded-md" :class="{
      'bg-green-100 text-green-700': messageType === 'success',
      'bg-red-100 text-red-700': messageType === 'error'
    }">
      {{ message }}
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Pesquisar veículos..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              @click="toggleSort('plate')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Placa {{ getSortIcon('plate') }}
            </th>
            <th 
              @click="toggleSort('brand')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Marca {{ getSortIcon('brand') }}
            </th>
            <th 
              @click="toggleSort('model')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Modelo {{ getSortIcon('model') }}
            </th>
            <th 
              @click="toggleSort('color')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Cor {{ getSortIcon('color') }}
            </th>
            <th 
              @click="toggleSort('registrationDate')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data Cadastro {{ getSortIcon('registrationDate') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="vehicle in vehicles" :key="vehicle.plate">
            <td class="px-6 py-4 whitespace-nowrap">{{ vehicle.plate }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ vehicle.brand }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ vehicle.model }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ vehicle.color }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(vehicle.registrationDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <router-link
                :to="{ name: 'edit-vehicle', params: { plate: vehicle.plate }}"
                class="text-blue-600 hover:text-blue-900"
              >
                Editar
              </router-link>
              <button
                @click="deleteVehicle(vehicle.plate)"
                class="text-red-600 hover:text-red-900"
              >
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="vehicles.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Nenhum veículo cadastrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>