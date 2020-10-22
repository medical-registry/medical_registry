<template>

    <v-card elevation="0">

      <v-card-title>Ricoveri </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.name}}</v-card-title>
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
                            <th v-if="item.acceptance" class="text-left">Accettazione</th>
                            <th v-if="item.discharge" class="text-left">Dimissioni</th>
                            <th v-if="item.note" class="text-left" style="width: 500px">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.trauma">{{item.trauma.name}}</td>
                        <td v-if="item.disease">{{item.diseaseRegister.name}}</td>
                        <td v-if="item.acceptance">{{item.acceptance}}</td>
                        <td v-if="item.discharge">
                            {{item.discharge}}</td>
                        <td colspan="4"/>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card>

</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';

export default {
  name: 'Hospitalization',
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchHospitalization() {
      const userHospitalization = await db.hospitalization
        .where({ id_person: this.$store.state.user.id }).toArray();
      // const keyedHospitalizationDefinitions = keyBy(userHospitalization, 'id_hospitalization');

      const userTraumas = await db.traumas
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedTraumaDefinitions = keyBy(userTraumas, 'id_trauma');
      const userDiseases = await db.diseases
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedDiseaseDefinitions = keyBy(userDiseases, 'id_care');
      const diseaseRegister = await db.disease_register.toArray();
      const keyedDiseaseRegisterDefinitions = keyBy(diseaseRegister, 'id');

      this.items = userHospitalization.map((item) => ({
        ...item,
        trauma: keyedTraumaDefinitions[item.id_trauma],
        disease: keyedDiseaseDefinitions[item.id_disease],
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
    this.fetchHospitalization();
  },
};
</script>
