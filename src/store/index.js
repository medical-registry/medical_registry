import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: () => ({
    user: {
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
    setUser(state, value) {
      state.user = value;
    },
  },
  actions: {
  },
  modules: {
  },
});

export default () => Store;
export { Store };
