import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

const Store = new Vuex.Store({
  plugins: [vuexLocal.plugin],
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
  getters: {
    user: (state) => state.count,
  },
  actions: {
  },
  modules: {
  },
});

export default () => Store;
export { Store };
