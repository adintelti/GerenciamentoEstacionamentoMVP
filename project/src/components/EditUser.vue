<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const store = useAuthStore();

const name = ref('');
const document = ref('');
const email = ref('');
const birthday = ref('');
const exitDate = ref('');
const message = ref('');
const originalDocument = route.params.document as string;

onMounted(() => {
  const user = store.findUser(originalDocument);
  if (!user) {
    router.push('/listUsers');
    return;
  }

  name.value = user.name;
  document.value = user.document;
  email.value = user.email;
  birthday.value = store.formatDate(user.birthday);
  exitDate.value = user.exitDate ? store.formatDate(user.exitDate) : '';
});

const handleSubmit = () => {
  if (!document.value || !name.value || !email.value || !birthday.value) {
    message.value = 'Por favor, preencha todos os campos.';
    return;
  }

  if (document.value !== originalDocument && store.findUser(document.value)) {
    message.value = 'Já existe um usuário cadastrado com este documento.';
    return;
  }

  const success = store.updateUser(originalDocument, {
    name: name.value,
    document: document.value,
    birthday: birthday.value,
    email: email.value,
    exitDate: exitDate.value,
    id: null,
    password: null
  });

  if (success) {
    router.push('/listUsers');
  } else {
    message.value = 'Erro ao atualizar o usuario.';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Editar Usuário</h2>
      <router-link
        to="/listUsers"
        class="text-blue-600 hover:text-blue-900"
      >
        Voltar para lista
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
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
        <label class="block text-sm font-medium text-gray-700">Documento</label>
        <input
          v-model="document"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          v-model="email"
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
      <div class="flex justify-end space-x-3">
        <router-link
          to="/listUsers"
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