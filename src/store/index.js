import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    user: {
      id: 123,
      userType: 'patient',
    },
    navigation: {
      leftDrawer: false,
    },
  }),
  mutations: {
    toggleLeftDrawer(state) {
      state.navigation.leftDrawer = !state.navigation.leftDrawer;
    },
    setLeftDrawer(state, value) {
      state.navigation.leftDrawer = value;
    },
  },
  actions: {
  },
  modules: {
  },
});
