import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Omit<User, 'password'> | null>(null);
  const router = useRouter();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const users = ref<User[]>([]);

  const isAuthenticated = computed(() => !!user.value);

  const initialize = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Email ou senha inválidos');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      user.value = userWithoutPassword;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      router.push('/dashboard');
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const loadList = async () =>
  {
    users.value = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  }

  const register = async (email: string, password: string, name: string, document: string, birthday: string | null) => {
    try {
      loading.value = true;
      error.value = null;

      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      birthday = formatarParaISO(birthday);

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        document,
        birthday,
        email,
        password,
        createdAt: new Date().toISOString(),
        exitDate: ''
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      user.value = userWithoutPassword;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      router.push('/dashboard');
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
  
    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatarParaISO = (data: string | null) => {
    if (data == null)
      return null;
    let partes = data.split("/");
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return null;
  };

  const findUser = (document: string) => {
    return users.value.find(v => v.document === document);
  };

  const updateUser = (originalDocument: string, updateduser: Omit<User, 'createdAt'>) => {
    const index = users.value.findIndex(v => v.document === originalDocument);
    if (index === -1) return false;

    updateduser.birthday = formatarParaISO(updateduser.birthday);
    updateduser.exitDate = formatarParaISO(updateduser.exitDate);

    const originalUser = users.value[index];
    users.value[index] = {
      ...updateduser,
      createdAt: originalUser.createdAt,
      password: originalUser.password
    };
    saveUsers();
    return true;
  };

  const saveUsers = () => {
    localStorage.setItem('users', JSON.stringify(users.value));
  };


  const logout = () => {
    user.value = null;
    localStorage.removeItem('currentUser');
    router.push('/login');

    users.value = [];
  };

  return {
    user,
    users,
    loading,
    error,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    loadList,
    findUser,
    updateUser,
    formatDate
  };
});