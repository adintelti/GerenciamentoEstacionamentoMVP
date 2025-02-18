<script setup lang="ts">
import { ref } from 'vue';
import { useParkingStore } from '../stores/parking';

const store = useParkingStore();

const name = ref('');
const document = ref('');
const username = ref('');
const birthday = ref('');
const exitDate = ref('');
const message = ref('');

const handleSubmit = () => {
  if (!name.value || !document.value || !username.value || !birthday.value) {
    message.value = 'Por favor, preencha todos os campos.';
    return;
  }

  const existingUser = store.findUser(document.value);
  if (existingUser) {
    message.value = 'Usuário já cadastrado.';
    return;
  }

  store.registerUser({
    name: name.value,
    document: document.value,
    username: username.value,
    birthday: birthday.value,
    exitDate: exitDate.value,
  });

  message.value = 'Usuário cadastrado com sucesso!';
  name.value = '';
  document.value = '';
  username.value = '';
  birthday.value = '';
  exitDate.value = '';
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Cadastro de Usuário</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Documento</label>
        <input
          v-model="document"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome</label>
        <input
          v-model="name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome de usuário</label>
        <input
          v-model="username"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Data de nascimento</label>
        <input
          v-model="birthday"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Data de demissão</label>
        <input
          v-model="exitDate"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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