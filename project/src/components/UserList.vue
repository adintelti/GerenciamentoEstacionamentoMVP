<script setup lang="ts">
import { ref, computed } from 'vue';
import { useParkingStore } from '../stores/parking';
import { useRouter } from 'vue-router';
import type { User } from '../types';

const store = useParkingStore();
const router = useRouter();
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const sortField = ref<keyof User>('registrationDate');
const sortDirection = ref<'asc' | 'desc'>('desc');

const users = computed(() => {
  const sorted = [...store.users].sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
});

const toggleSort = (field: keyof User) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const getSortIcon = (field: keyof User) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const deleteUser = (plate: string) => {
  const canDelete = store.canDeleteUser(plate);
  if (!canDelete) {
    message.value = 'Não é possível excluir um veículo com estadias no dia atual.';
    messageType.value = 'error';
    return;
  }

  store.deleteUser(plate);
  message.value = 'Usuário excluído com sucesso.';
  messageType.value = 'success';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

const navigateToRegister = () => {
  router.push('/registerUser');
};
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Lista de Usuários</h2>
      <button
        @click="navigateToRegister"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Novo Usuário
      </button>
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
            <th 
              @click="toggleSort('document')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Document {{ getSortIcon('document') }}
            </th>
            <th 
              @click="toggleSort('name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Nome {{ getSortIcon('name') }}
            </th>
            <th 
              @click="toggleSort('username')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Usuario {{ getSortIcon('username') }}
            </th>
            <th 
              @click="toggleSort('birthday')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data de Nascimento {{ getSortIcon('birthday') }}
            </th>
            <th 
              @click="toggleSort('registrationDate')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data Cadastro {{ getSortIcon('registrationDate') }}
            </th>
            <th 
              @click="toggleSort('exitDate')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data demissão {{ getSortIcon('exitDate') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.document">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.document }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(user.birthday) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(user.registrationDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.exitDate ? formatDate(user.exitDate) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <router-link
                :to="{ name: 'edit-user', params: { document: user.document }}"
                class="text-blue-600 hover:text-blue-900"
              >
                Editar
              </router-link>
              <button
                @click="deleteUser(user.document)"
                class="text-red-600 hover:text-red-900"
              >
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Nenhum usuário cadastrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>