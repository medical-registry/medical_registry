import './registerServiceWorker';
import Vue from 'vue';
import axios from 'axios';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
