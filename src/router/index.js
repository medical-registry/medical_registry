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
    name: 'Visite & Esami non di Laboratorio ',
    icon: 'mdi-radioactive',
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
    path: '/diseases',
    name: 'Patologie',
    icon: 'mdi-emoticon-sick-outline',
    component: () => import('../views/Diseases.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/allergies',
    name: 'Allergie',
    icon: 'mdi-flower',
    component: () => import('../views/Allergies.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/family',
    name: 'Patologie Parenti',
    icon: 'mdi-human-cane',
    component: () => import('../views/Family.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/traumas',
    name: 'Traumi',
    icon: 'mdi-flash',
    component: () => import('../views/Traumas.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/interventions',
    name: 'Interventi',
    icon: 'mdi-doctor',
    component: () => import('../views/Interventions.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/hospitalizations',
    name: 'Ricoveri',
    icon: 'mdi-hospital',
    component: () => import('../views/Hospitalizations.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/medicines',
    name: 'Farmaci',
    icon: 'mdi-flask-outline',
    component: () => import('../views/Medicines.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/therapies',
    name: 'Terapie non Farmacologiche',
    icon: 'mdi-food-off',
    component: () => import('../views/Therapies.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },

  {
    path: '/vaccines',
    name: 'Vaccini',
    icon: 'mdi-needle',
    component: () => import('../views/Vaccines.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/timeline',
    name: 'Cronologia',
    icon: 'mdi-clock-time-eight',
    component: () => import('../views/Timeline.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/notifications',
    name: 'Notifiche',
    icon: 'mdi-bell',
    component: () => import('../views/Notifications.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/receipts',
    name: 'Ricette',
    icon: 'mdi-prescription',
    component: () => import('../views/Receipts.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/fiscal',
    name: 'Ricevute',
    icon: 'mdi-receipt',
    component: () => import('../views/Fiscal.vue'),
    meta: { requiresLogin: true, drawer: true, groupHome: true },
  },
  {
    path: '/about',
    name: 'About',
    icon: 'mdi-information-variant',
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
