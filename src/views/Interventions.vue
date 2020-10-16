<template>

    <v-card elevation="0">
      <v-card-title>Interventi </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.intervention.name}}</v-card-title>
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
                            <th class="text-left">Causa</th>
                            <th v-if="item.note != null" class="text-left">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.trauma.name != null">{{item.trauma.name}}</td>
                        <td v-else>{{item.disease_register.name}}</td>
                        <td v-if="item.note != null">{{item.note}}</td>
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
    async fetchInterventions() {
      const userIntervention = await db.interventions
        .where({ id_person: this.$store.state.user.id }).toArray();
      const interventionIds = [...new Set(userIntervention.map((item) => item.id_intervention))];
      const interventionRegister = await db.intervention_register.bulkGet(interventionIds);
      const keyedInterventionDefinitions = keyBy(interventionRegister, 'id');
      const userTraumas = await db.traumas
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedTraumaDefinitions = keyBy(userTraumas, 'id_trauma');
      const userDiseases = await db.diseases
        .where({ id_person: this.$store.state.user.id }).toArray();
      const diseaseIds = [...new Set(userDiseases.map((item) => item.id_disease))];
      const keyedDiseaseDefinitions = keyBy(userDiseases, 'id_disease');
      const diseaseRegister = await db.disease_register.bulkGet(diseaseIds);
      const keyedDiseaseRegisterDefinitions = keyBy(diseaseRegister, 'id');

      this.items = userIntervention.map((item) => ({
        ...item,
        intervention: keyedInterventionDefinitions[item.id_intervention],
        trauma: keyedTraumaDefinitions[item.id_trauma],
        disease: keyedDiseaseDefinitions[item.id_disease],
        disease_register: keyedDiseaseRegisterDefinitions[item.disease],

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
    this.fetchInterventions();
  },
};
</script>
