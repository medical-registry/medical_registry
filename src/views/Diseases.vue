<template>

    <v-card elevation="0">
      <v-card-title>Patologie </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.disease.name}}
                ({{item.chronic}})
            </v-card-title>
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
                            <th v-if="item.body_impacted != null" class="text-left">
                                Parte del Corpo</th>
                            <th v-if="item.note != null" class="text-left">Note</th>
                            <th v-if="item.medical_exemption != null" class="text-left">
                                Esenzione Medica</th>
                            <th v-if="item.medical_exemption_code != null" class="text-left">
                                Codice Esenzione</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.body_impacted != null">{{item.body_impacted}}</td>
                        <td v-if="item.note != null">{{item.note}}</td>
                        <td v-if="item.medical_exemption != null">{{item.medical_exemption}}</td>
                        <td v-if="item.medical_exemption_code != null">
                            {{item.medical_exemption_code}}</td>
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
