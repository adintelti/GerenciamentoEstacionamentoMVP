<script setup lang="ts">
import { ref } from 'vue';
import { useParkingStore } from '../stores/parking';

const store = useParkingStore();

const plate = ref('');
const brand = ref('');
const model = ref('');
const color = ref('');
const message = ref('');

const handleSubmit = () => {
  if (!plate.value || !brand.value || !model.value || !color.value) {
    message.value = 'Por favor, preencha todos os campos.';
    return;
  }

  const existingVehicle = store.findVehicle(plate.value);
  if (existingVehicle) {
    message.value = 'Veículo já cadastrado.';
    return;
  }

  store.registerVehicle({
    plate: plate.value,
    brand: brand.value,
    model: model.value,
    color: color.value,
  });

  message.value = 'Veículo cadastrado com sucesso!';
  plate.value = '';
  brand.value = '';
  model.value = '';
  color.value = '';
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Cadastro de Veículo</h2>
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
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Cadastrar
      </button>
    </form>
    <p v-if="message" class="mt-4 text-center" :class="{'text-green-600': message.includes('sucesso'), 'text-red-600': !message.includes('sucesso')}">
      {{ message }}
    </p>
  </div>
</template>