import '@/registerServiceWorker';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import * as VueGoogleMaps from 'vue2-google-maps';

import vuetify from '@/plugins/vuetify';
import store from '@/store';
import router from '@/router';
import App from '@/App.vue';

moment.locale('it-it');

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDUVv7caIowYAooFBMc3WISL7da4Kmzvmw',
    libraries: 'places',
    region: 'IT',
    language: 'it',
  },
});
Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
