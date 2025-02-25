<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const auth = useAuthStore();
const activeTab = ref('list');

onMounted(() => {
  auth.initialize();
});

const navigateTo = (tab: string) => {
  activeTab.value = tab;
  router.push(`/${tab}`);
};

const handleLogout = async () => {
  await auth.logout();
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <template v-if="auth.isAuthenticated">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">Sistema de Estacionamento</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  @click="navigateTo('listUsers')"
                  :class="[
                    'inline-flex items-center px-1 pt-1 border-b-2',
                    activeTab === 'listUsers'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                  Gerenciar usuários
                </button>
                <button
                  @click="navigateTo('list')"
                  :class="[
                    'inline-flex items-center px-1 pt-1 border-b-2',
                    activeTab === 'list'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                Gerenciar Veículos
                </button>
                <button
                  @click="navigateTo('parking')"
                  :class="[
                    'inline-flex items-center px-1 pt-1 border-b-2',
                    activeTab === 'parking'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                  Controle de Estacionamento
                </button>
                <button
                  @click="navigateTo('records')"
                  :class="[
                    'inline-flex items-center px-1 pt-1 border-b-2',
                    activeTab === 'records'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                  Estadias do Dia
                </button>
              </div>
            </div>
            <div class="flex items-center">
              <button
                @click="handleLogout"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="py-6 px-4">
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
      </main>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>