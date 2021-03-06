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
                            <th class="text-left">Causa (link)</th>
                            <th v-if="item.note" class="text-left" style="width: 500px">Note</th>
                            <th v-if="item.body_impacted" class="text-left">
                                Parte del corpo</th>
                             <th class="text-left">Informazioni ricovero</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.trauma">{{item.trauma.name}}</td>
                        <td v-if="item.disease">{{item.diseaseRegister.name}}</td>
                        <td v-if="item.note">{{item.note}}</td>
                        <td v-if="item.body_impacted">
                            {{item.body_impacted}}</td>
                        <td >Link Ricovero</td>
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
            invalid-hint="Seleziona Intervento"
            label="Intervento"
            :table="database.intervention_register"
        />

    </v-card>

</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Interventions',
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
      const keyedDiseaseDefinitions = keyBy(userDiseases, 'id_care');
      const diseaseRegister = await db.disease_register.toArray();
      const keyedDiseaseRegisterDefinitions = keyBy(diseaseRegister, 'id');

      const userHospitalizations = await db.hospitalization
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedHospitalizationDefinitions = keyBy(userHospitalizations, 'id_hospitalization');

      this.items = userIntervention.map((item) => ({
        ...item,
        intervention: keyedInterventionDefinitions[item.id_intervention],
        trauma: keyedTraumaDefinitions[item.id_trauma],
        disease: keyedDiseaseDefinitions[item.id_disease],
        hospitalization: keyedHospitalizationDefinitions[item.id_hospitalization],
        diseaseRegister:
          keyedDiseaseRegisterDefinitions[
            keyedDiseaseDefinitions[item.id_disease]?.id_disease ?? 0],

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
