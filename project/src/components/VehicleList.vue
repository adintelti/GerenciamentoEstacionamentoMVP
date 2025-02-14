<script setup lang="ts">
import { ref, computed } from 'vue';
import { useParkingStore } from '../stores/parking';
import type { Vehicle } from '../types';

const store = useParkingStore();
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const vehicles = computed(() => store.vehicles);

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
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Lista de Veículos</h2>
    </div>

    <div v-if="message" class="mb-4 p-4 rounded-md" :class="{
      'bg-green-100 text-green-700': messageType === 'success',
      'bg-red-100 text-red-700': messageType === 'error'
    }">
      {{ message }}
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
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