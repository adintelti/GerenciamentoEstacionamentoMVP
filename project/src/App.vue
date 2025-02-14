<script setup lang="ts">
import { ref } from 'vue';
import VehicleRegistration from './components/VehicleRegistration.vue';
import ParkingControl from './components/ParkingControl.vue';

const activeTab = ref('registration');
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Sistema de Estacionamento</h1>
      
      <div class="flex justify-center space-x-4 mb-6">
        <button
          @click="activeTab = 'registration'"
          :class="[
            'px-4 py-2 rounded-md',
            activeTab === 'registration'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          Cadastro de Veículos
        </button>
        <button
          @click="activeTab = 'parking'"
          :class="[
            'px-4 py-2 rounded-md',
            activeTab === 'parking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          Controle de Estacionamento
        </button>
      </div>

      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <VehicleRegistration v-if="activeTab === 'registration'" />
        <ParkingControl v-else />
      </Transition>
    </div>
  </div>
</template>