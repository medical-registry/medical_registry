<template>
  <v-navigation-drawer
    v-model="isOpen"
    app
    disable-resize-watcher
  >
    <v-list dense>
      <div v-for="route in drawerItems" :key="route.path">
        <v-list-group v-if="route.isGroup">
          <v-list-item-group e @click.stop="close">
            <v-list-item
              v-for="(item, i) in route.items"
              :key="route.path +i"
              e @click.stop="close"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
        <v-list-item :to="route.path" v-else @click.stop="close">
          <v-list-item-action>
            <v-icon>{{route.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{route.name}}
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
      const routes = [...this.$router.options.routes];
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
      if (window.innerWidth < 1264) {
        this.$store.commit('setLeftDrawer', false);
      }
    },
  },
};

</script>
