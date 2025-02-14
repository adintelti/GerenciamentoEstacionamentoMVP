<script setup lang="ts">
import { ref } from 'vue';
import { useParkingStore } from '../stores/parking';

const store = useParkingStore();
const plate = ref('');
const message = ref('');
const isEntry = ref(true);

const handleSubmit = () => {
  if (!plate.value) {
    message.value = 'Por favor, informe a placa do veículo.';
    return;
  }

  const result = isEntry.value
    ? store.registerEntry(plate.value)
    : store.registerExit(plate.value);

  message.value = result.message;
  if (result.success) {
    plate.value = '';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Controle de Estacionamento</h2>
    <div class="flex justify-center space-x-4 mb-4">
      <button
        @click="isEntry = true"
        :class="[
          'px-4 py-2 rounded-md',
          isEntry
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700'
        ]"
      >
        Entrada
      </button>
      <button
        @click="isEntry = false"
        :class="[
          'px-4 py-2 rounded-md',
          !isEntry
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700'
        ]"
      >
        Saída
      </button>
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Placa do Veículo</label>
        <input
          v-model="plate"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ isEntry ? 'Registrar Entrada' : 'Registrar Saída' }}
      </button>
    </form>
    <p v-if="message" class="mt-4 text-center" :class="{'text-green-600': message.includes('sucesso') || message.includes('Obrigado'), 'text-red-600': !message.includes('sucesso') && !message.includes('Obrigado')}">
      {{ message }}
    </p>
  </div>
</template>