<template>
  <v-app id="inspire">
    <left-drawer/>
    <app-bar/>
    <v-main>
      <v-container
        fluid
      >
        <router-view/>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
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
  data: () => ({
    drawer: null,
  }),
};
</script>
