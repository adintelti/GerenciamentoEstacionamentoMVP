<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useParkingStore } from '../stores/parking';

const route = useRoute();
const router = useRouter();
const store = useParkingStore();

const name = ref('');
const document = ref('');
const username = ref('');
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
  username.value = user.username;
  birthday.value = formatDate(user.birthday);
  exitDate.value = user.exitDate ? formatDate(user.exitDate) : '';
});

const handleSubmit = () => {
  if (!document.value || !name.value || !username.value || !birthday.value) {
    message.value = 'Por favor, preencha todos os campos.';
    return;
  }

  if (document.value !== originalDocument && store.findUser(document.value)) {
    message.value = 'Já existe um usuário cadastrado com este documento.';
    return;
  }

  const success = store.updateUser(originalDocument, {
    document: document.value,
    name: name.value,
    username: username.value,
    birthday: birthday.value,
    exitDate: exitDate.value
  });

  if (success) {
    router.push('/listUsers');
  } else {
    message.value = 'Erro ao atualizar o usuario.';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString.split('T')[0]).toLocaleDateString('pt-BR');
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
        <label class="block text-sm font-medium text-gray-700">Nome de Usuario</label>
        <input
          v-model="username"
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
      <div>
        <label class="block text-sm font-medium text-gray-700">Data de nascimento</label>
        <input
          v-model="birthday"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
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