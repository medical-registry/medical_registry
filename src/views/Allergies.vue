<template>

    <v-card elevation="0">
      <v-card-title>Allergie </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.allergy.name}}
              ({{item.allergy.category}})</v-card-title>
            <v-card-title v-if="!item.to" class="headline capitalized">{{formatDate(item.from)}}
            </v-card-title>
            <v-card-title v-else class="headline capitalized">Dal {{formatDate(item.from)}}
              al {{formatDate(item.to)}}
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                          <tr>
                            <th class="text-left">Intolleranza</th>
                            <th class="text-left">Severità</th>
                            <th v-if="item.note" class="text-left">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.intolerance=='N'">No</td>
                        <td v-else>Si</td>
                        <td>{{item.severity}}</td>
                        <td v-if="item.note">{{item.note}}</td>
                        <td colspan="4"/>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
        <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :table="database.allergy_register"
        />

    </v-card>

</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Allergies',
  components: { AutocompleteSearch },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchAllergies() {
      const userAllergies = await db.allergies
        .where({ id_person: this.$store.state.user.id }).toArray();
      const allergyIds = [...new Set(userAllergies.map((item) => item.id_allergy))];
      const allergyRegister = await db.allergy_register.bulkGet(allergyIds);
      const keyedAllergyDefinitions = keyBy(allergyRegister, 'id');
      this.items = userAllergies.map((item) => ({
        ...item,
        allergy: keyedAllergyDefinitions[item.id_allergy],
      }));
    },
  },
  data() {
    return {
      database: db,
      items: null,
    };
  },
  created() {
    this.fetchAllergies();
  },
};
</script>
