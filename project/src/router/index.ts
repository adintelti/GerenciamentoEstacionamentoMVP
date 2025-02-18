import { createRouter, createWebHistory } from 'vue-router';
import VehicleRegistration from '../components/VehicleRegistration.vue';
import VehicleList from '../components/VehicleList.vue';
import EditVehicle from '../components/EditVehicle.vue';
import EditUser from '../components/EditUser.vue';
import ParkingControl from '../components/ParkingControl.vue';
import ParkingRecordsList from '../components/ParkingRecordsList.vue';
import UserList from '../components/UserList.vue';
import UserRegistration from '../components/UserRegistration.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/list'
    },
    {
      path: '/register',
      name: 'register-vehicle',
      component: VehicleRegistration
    },
    {
      path: '/registerUser',
      name: 'register-user',
      component: UserRegistration
    },
    {
      path: '/listUsers',
      name: 'user-list',
      component: UserList
    },
    {
      path: '/list',
      name: 'vehicle-list',
      component: VehicleList
    },
    {
      path: '/edit/:plate',
      name: 'edit-vehicle',
      component: EditVehicle
    },
    {
      path: '/editUser/:document',
      name: 'edit-user',
      component: EditUser
    },
    {
      path: '/parking',
      name: 'parking-control',
      component: ParkingControl
    },
    {
      path: '/records',
      name: 'parking-records',
      component: ParkingRecordsList
    }
  ]
});

export default router;