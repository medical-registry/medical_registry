<template>

    <v-card elevation="0">
      <v-card-title>Patologie Parenti </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
             <v-card-title v-if="item.chronic==true" class="text-center">
                   {{item.disease.name}} (Cronico)</v-card-title>
              <v-card-title v-else class="text-center">
                   {{item.disease.name}}</v-card-title>
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
                            <th v-if="item.parent_type" class="text-left">
                              Grado di Parentela</th>
                            <th v-if="item.body_impacted" class="text-left">
                              Parte del corpo</th>
                            <th v-if="item.discovered_at_age" class="text-left">
                              Scoperto all'età di</th>
                            <th v-if="item.note" class="text-left" style="width: 500px">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.parent_type" class="text-left">
                          {{item.parent_type}}</td>
                <td v-if="item.body_impacted" class="text-left">{{item.body_impacted}}</td>
                        <td v-if="item.discovered_at_age" class="text-left">
                            {{item.discovered_at_age}} anni</td>
                        <td v-if="item.note" class="text-left">{{item.note}}</td>
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
            invalid-hint="Seleziona Patologia"
            label="Patologia"
            :table="database.disease_register"
        />

    </v-card>

</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Family',
  components: { AutocompleteSearch },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchDiseases() {
      const userDiseaseParental = await db.diseases_parental
        .where({ id_person: this.$store.state.user.id }).toArray();
      const diseaseIds = [...new Set(userDiseaseParental.map((item) => item.id_disease))];
      const diseaseRegister = await db.disease_register.bulkGet(diseaseIds);
      const keyedDiseaseDefinitions = keyBy(diseaseRegister, 'id');
      this.items = userDiseaseParental.map((item) => ({
        ...item,
        disease: keyedDiseaseDefinitions[item.id_disease],
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
    this.fetchDiseases();
  },
};
</script>
