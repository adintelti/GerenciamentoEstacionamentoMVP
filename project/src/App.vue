<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('list');

const navigateTo = (tab: string) => {
  activeTab.value = tab;
  router.push(`/${tab}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Sistema de Estacionamento</h1>
      
      <div class="flex justify-center space-x-4 mb-6">
        <button
          @click="navigateTo('list')"
          :class="[
            'px-4 py-2 rounded-md',
            activeTab === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          Lista de Veículos
        </button>
        <button
          @click="navigateTo('parking')"
          :class="[
            'px-4 py-2 rounded-md',
            activeTab === 'parking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          Controle de Estacionamento
        </button>
        <button
          @click="navigateTo('records')"
          :class="[
            'px-4 py-2 rounded-md',
            activeTab === 'records'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          Estadias do Dia
        </button>
      </div>

      <router-view v-slot="{ Component }">
        <Transition
          enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>