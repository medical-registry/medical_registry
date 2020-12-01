<template>
  <v-navigation-drawer v-model="isOpen" app disable-resize-watcher>
    <v-list dense>
      <div v-for="route in drawerItems" :key="route.path">
        <v-list-item :to="route.path" @click.stop="close">
          <v-list-item-action>
            <v-icon>{{route.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{route.name}}
          </v-list-item-content>
        </v-list-item>
      </div>
      <div>
        <v-list-item @click.stop="logout">
          <v-list-item-action>
            <v-icon>logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
           Logout
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'LeftDrawer',
  computed: {
    drawerItems() {
      const routes = [...this.$router.options.routes]
        .filter((item) => item.meta && item.meta.drawer);
      for (let i = 0; i < routes.length; i += 1) {
        if (routes[i].groupHome) {
          routes[i].items = routes[i].fetchItems();
        }
      }
      return routes;
    },
    isOpen: {
      get() {
        return this.$store.state.navigation.leftDrawer;
      },
      set(value) {
        return value;
      },
    },
  },
  methods: {
    close() {
      this.$store.commit('setLeftDrawer', false);
    },
    logout() {
      this.$store.commit('setUser', null);
      this.$router.push({ path: '/login' });
      this.$store.commit('toggleLeftDrawer');
    },
  },
};

</script>
