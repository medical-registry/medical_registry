<template>
  <v-app-bar
    app
    color="blue darken-3"
    dark
  >
    <v-app-bar-nav-icon @click.stop="toggleLeftDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Medical Registry</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
  methods: {
    toggleLeftDrawer() {
      this.$store.commit('toggleLeftDrawer');
    },
  },
};

</script>
