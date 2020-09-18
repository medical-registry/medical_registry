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
    drawer: true,
    meta: { requiresLogin: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/exams',
    name: 'Esami',
    icon: 'mdi-clipboard-text',
    groupHome: true,
    drawer: true,
    // eslint-disable-next-line no-return-await
    fetchItems: async () => await api.fetchUserExamsCategories(),
    component: () => import('../views/Exams.vue'),
    meta: { requiresLogin: true },
  },
  {
    path: '/about',
    name: 'About',
    icon: 'mdi-email',
    drawer: true,
    component: () => import('../views/About.vue'),
    meta: { requiresLogin: true },
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
  } else if (to.name === 'Login' && Store.state.user && Store.state.user.id) {
    next('/');
  } else {
    next();
  }
});
export default router;
