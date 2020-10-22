<template>

    <v-card elevation="0">
      <v-card-title>Patologie </v-card-title>
      <v-container>
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
                              <th v-if="item.body_impacted" class="text-left">
                                  Parte del Corpo</th>
                              <th v-if="item.note" class="text-left" style="width: 500px">Note</th>
                              <th v-if="item.medical_exemption" class="text-left">
                                  Esenzione Medica</th>
                              <th v-if="item.medical_exemption_code" class="text-left">
                                  Codice Esenzione</th>
                              <th v-if="item.medical_exemption_number" class="text-left">
                                  Numero Esenzione</th>
                              <th colspan="2"/>
                            </tr>
                      </thead>
                      <tbody>
                          <tr>
                          <td v-if="item.body_impacted">{{item.body_impacted}}</td>
                          <td v-if="item.note">{{item.note}}</td>
                          <td v-if="item.medical_exemption">{{item.medical_exemption}}</td>
                          <td v-if="item.medical_exemption_code">
                              {{item.medical_exemption_code}}</td>
                          <td v-if="item.medical_exemption_number">
                              {{item.medical_exemption_number}}</td>
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
      </v-container>
    </v-card>

</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Diseases',
  components: { AutocompleteSearch },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchDiseases() {
      const userDiseases = await db.diseases
        .where({ id_person: this.$store.state.user.id }).toArray();
      const diseasesIds = [...new Set(userDiseases.map((item) => item.id_disease))];
      const diseaseRegister = await db.disease_register.bulkGet(diseasesIds);
      const keyedDiseaseDefinitions = keyBy(diseaseRegister, 'id');
      this.items = userDiseases.map((item) => ({
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
