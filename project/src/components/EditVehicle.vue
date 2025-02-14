<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useParkingStore } from '../stores/parking';

const route = useRoute();
const router = useRouter();
const store = useParkingStore();

const plate = ref('');
const brand = ref('');
const model = ref('');
const color = ref('');
const message = ref('');
const originalPlate = route.params.plate as string;

onMounted(() => {
  const vehicle = store.findVehicle(originalPlate);
  if (!vehicle) {
    router.push('/list');
    return;
  }

  plate.value = vehicle.plate;
  brand.value = vehicle.brand;
  model.value = vehicle.model;
  color.value = vehicle.color;
});

const handleSubmit = () => {
  if (!plate.value || !brand.value || !model.value || !color.value) {
    message.value = 'Por favor, preencha todos os campos.';
    return;
  }

  if (plate.value !== originalPlate && store.findVehicle(plate.value)) {
    message.value = 'Já existe um veículo cadastrado com esta placa.';
    return;
  }

  const success = store.updateVehicle(originalPlate, {
    plate: plate.value,
    brand: brand.value,
    model: model.value,
    color: color.value,
  });

  if (success) {
    router.push('/list');
  } else {
    message.value = 'Erro ao atualizar o veículo.';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Editar Veículo</h2>
      <router-link
        to="/list"
        class="text-blue-600 hover:text-blue-900"
      >
        Voltar para lista
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Placa</label>
        <input
          v-model="plate"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Marca</label>
        <input
          v-model="brand"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Modelo</label>
        <input
          v-model="model"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Cor</label>
        <input
          v-model="color"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div class="flex justify-end space-x-3">
        <router-link
          to="/list"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </router-link>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </form>
    <p v-if="message" class="mt-4 text-center text-red-600">
      {{ message }}
    </p>
  </div>
</template>