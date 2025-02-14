import { createRouter, createWebHistory } from 'vue-router';
import VehicleRegistration from '../components/VehicleRegistration.vue';
import VehicleList from '../components/VehicleList.vue';
import EditVehicle from '../components/EditVehicle.vue';
import ParkingControl from '../components/ParkingControl.vue';
import ParkingRecordsList from '../components/ParkingRecordsList.vue';

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