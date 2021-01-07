<template>
  <v-app-bar app color="blue darken-3" dark class="pr-3">
    <v-app-bar-nav-icon @click.stop="toggleLeftDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Medical Registry</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu left bottom >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-badge color="green" :content="notifications.length">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list three-line nav>
        <template  v-for="(item, idx) in notifications">
          <div :key="idx">
            <v-list-item style="max-width: 500px; cursor: pointer">
              <v-list-item-avatar class="mt-8">
               <v-icon color="primary" v-if="item.type==='suggestion'">
                 mdi-bell-outline
               </v-icon>
               <v-icon color="primary" v-if="item.type==='results'">
                 mdi-upload
               </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-if="item.type==='suggestion'">Suggerimenti</v-list-item-title>
                <v-list-item-title v-if="item.type==='results'">Risultati</v-list-item-title>
                <v-list-item-subtitle v-html="item.text"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="idx < notifications.length-1"/>
          </div>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
const notifications = [
  {
    type: 'suggestion',
    text: 'Nel 2020 non hai fatto l\'esame Colesterolo, mantienilo monitorato!',
  },
  {
    type: 'suggestion',
    text: 'Nella tua fascia d\'età dovresti iniziare lo screening della prostata, la prevenzione è la migliore arma possibile, usala!',
  },
  {
    type: 'results',
    text: 'I risultati degli esami del sangue eseguiti il <b>01/03/2019</b> sono disponibili nella sezione <i>Esami di Laboratorio</i>.',
  },
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
