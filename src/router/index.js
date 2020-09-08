import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '@/services/api/index';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    icon: 'mdi-home',
    component: Home,
  },
  {
    path: '/exams',
    name: 'Esami',
    icon: 'mdi-clipboard-text',
    groupHome: true,
    // eslint-disable-next-line no-return-await
    fetchItems: async () => await api.fetchUserExamsCategories(),
    component: () => import('../views/Exams.vue'),
  },
  {
    path: '/about',
    name: 'About',
    icon: 'mdi-email',
    component: () => import('../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
