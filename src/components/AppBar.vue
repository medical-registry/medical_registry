<template>
  <v-app-bar app color="blue darken-3" dark class="pr-3">
    <v-app-bar-nav-icon @click.stop="toggleLeftDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Medical Registry</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-badge color="green" :content="notifications.length">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(text, idx) in notifications" :key="idx" @click="() => {}">
          <v-list-item-title>{{text}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
const notifications = [
  'Nel 2020 non hai fatto l\'esame Colesterolo, mantienilo monitorato!',
  'Nella tua fascia d\'età dovresti iniziare lo screening della prostata, la prevenzione è la migliore arma possibile, usala!',
];

export default {
  name: 'AppBar',
  methods: {
    toggleLeftDrawer() {
      this.$store.commit('toggleLeftDrawer');
    },
  },
  data() {
    return {
      notifications,
    };
  },
};

</script>
