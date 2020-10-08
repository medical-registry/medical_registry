import Vue from 'vue';
import VueRouter from 'vue-router';
import { Store } from '@/store';
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
    component: () => import('../views/Exams.vue'),
    meta: { requiresLogin: true, drawer: true },
  },
  {
    path: '/lab_exams',
    name: 'Esami Di Laboratorio',
    icon: 'mdi-test-tube',
    component: () => import('@/views/LabExam.vue'),
    meta: { requiresLogin: true, drawer: true },
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
