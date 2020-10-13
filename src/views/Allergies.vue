<template>

    <v-card>Allergie
        <span v-for="item in items" :key="item.id_care">{{item.id_allergy}}</span>
        <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :table="database.allergy_register"
        />

    </v-card>

</template>

<script>
import db from '@/services/database';
// import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Allergies',
  components: { AutocompleteSearch },
  methods: {
    async fetchAllergies() {
      const userAllergies = await db.allergies.where({ id_person: 1 }).toArray();
      // const allergyIds = [...new Set(userAllergies.map((item) =>
      // item.id_allergy).filter((id) => !!id))];
      this.items = userAllergies;
    },
  },
  data() {
    return {
      database: db,
      items: null,
    };
  },
};
</script>
