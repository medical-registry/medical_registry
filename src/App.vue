<template>
  <v-app id="inspire">
    <left-drawer v-if="user && user.id"/>
    <app-bar v-if="user && user.id"/>
    <v-main v-if="dbReady">
      <router-view/>
    </v-main>
    <v-main v-else>
      <v-layout fill-height
                fluid
                class="blue darken-1">
        <v-row align="center"
               justify="center">
          <v-progress-circular
            :size="150"
            :width="15"
            :value="loadingPercent"
            color="blue lighten-5"
          >
            {{loadingPercent}}%
          </v-progress-circular>
        </v-row>
      </v-layout>
    </v-main>
    <v-footer
      color="blue darken-3"
      app
    >
      <span class="white--text">Medical Registry &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import { init } from '@/services/database';
import LeftDrawer from './components/LeftDrawer.vue';
import AppBar from './components/AppBar.vue';

export default {
  components: {
    AppBar,
    LeftDrawer,
  },
  props: {
    source: String,
  },
  computed: mapState(['user']),
  // watch: {
  //   user(newValue) {
  //     this.user = newValue;
  //   },
  // },
  mounted() {
    init(this.updateLoadingPercent)
      .then(() => {
        this.dbReady = true;
      });
  },
  methods: {
    updateLoadingPercent(total, items) {
      this.totalEntries = total;
      this.addedEntries += items;
      console.log(`${Math.round(100 * (this.addedEntries / this.totalEntries))}%`);
      this.loadingPercent = Math.round(100 * (items / total));
    },
  },
  data: () => ({
    drawer: null,
    dbReady: false,
    loadingPercent: 0,
    totalEntries: 1,
    addedEntries: 1,
  }),
};
</script>
