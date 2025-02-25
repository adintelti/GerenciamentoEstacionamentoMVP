<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import type { User } from '../types';

const store = useAuthStore();
const router = useRouter();
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const sortField = ref<keyof User>('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');
const searchQuery = ref('');

const users = computed(() => {
  store.loadList();

  if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return store.users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.document.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.createdAt.toLowerCase().includes(query)
    );
  }

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

const navigateToRegister = () => {
  router.push('/registerUser');
};
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Lista de Usuários</h2>
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar usuários..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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
              @click="toggleSort('email')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Usuario {{ getSortIcon('email') }}
            </th>
            <th 
              @click="toggleSort('birthday')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data de Nascimento {{ getSortIcon('birthday') }}
            </th>
            <th 
              @click="toggleSort('createdAt')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Data Cadastro {{ getSortIcon('createdAt') }}
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
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.birthday ? store.formatDate(user.birthday) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ store.formatDate(user.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.exitDate ? store.formatDate(user.exitDate) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              <router-link
                :to="{ name: 'edit-user', params: { document: user.document }}"
                class="text-blue-600 hover:text-blue-900"
              >
                Editar
              </router-link>
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