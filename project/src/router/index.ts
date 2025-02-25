import { createRouter, createWebHistory } from 'vue-router';
import VehicleRegistration from '../components/VehicleRegistration.vue';
import VehicleList from '../components/VehicleList.vue';
import EditVehicle from '../components/EditVehicle.vue';
import ParkingControl from '../components/ParkingControl.vue';
import ParkingRecordsList from '../components/ParkingRecordsList.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import UserList from '../components/UserList.vue';
import EditUser from '../components/EditUser.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
        {
      path: '/listUsers',
      name: 'users-list',
      component: UserList,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:document',
      name: 'edit-user',
      component: EditUser,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      redirect: '/list',
      meta: { requiresAuth: true }
    },
    {
      path: '/register-vehicle',
      name: 'register-vehicle',
      component: VehicleRegistration,
      meta: { requiresAuth: true }
    },
    {
      path: '/list',
      name: 'vehicle-list',
      component: VehicleList,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:plate',
      name: 'edit-vehicle',
      component: EditVehicle,
      meta: { requiresAuth: true }
    },
    {
      path: '/parking',
      name: 'parking-control',
      component: ParkingControl,
      meta: { requiresAuth: true }
    },
    {
      path: '/records',
      name: 'parking-records',
      component: ParkingRecordsList,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && auth.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;