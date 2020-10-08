import '@/registerServiceWorker';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import axios from 'axios';

import vuetify from '@/plugins/vuetify';
import store from '@/store';
import router from '@/router';
import App from '@/App.vue';
import moment from 'moment';

moment.locale('it-it');

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
