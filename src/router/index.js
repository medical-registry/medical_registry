import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '@/services/api/index';
// eslint-disable-next-line import/named
import { Store } from '@/store/index';
import PatientHome from '@/views/PatientHome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/patient_home',
    name: 'Home',
    icon: 'mdi-home',
    component: PatientHome,
    meta: { requiresLogin: true, drawer: true },
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/login',
    name: 'Login Page',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/exams',
    name: 'Esami',
    icon: 'mdi-clipboard-text',
    // eslint-disable-next-line no-return-await
    fetchItems: async () => await api.fetchUserExamsCategories(),
    component: () => import('../views/Exams.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/about',
    name: 'About',
    icon: 'mdi-email',
    component: () => import('../views/About.vue'),
    meta: { requiresLogin: true, drawer: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)
      && !(Store.state.user && Store.state.user.id)) {
    next('/login');
  } else {
    next();
  }
});
export default router;
