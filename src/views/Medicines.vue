<template>

    <v-card elevation="0">
      <v-card-title>Farmaci </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_care" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.medicine.name}}</v-card-title>
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
                            <th class="text-left" style="width: 500px">Causa</th>
                            <th v-if="item.dosage" class="text-left">Dosaggio</th>
                            <th v-if="item.unit" class="text-left">
                                Unità</th>
                             <th v-if="item.daily_frequency" class="text-left">
                                 Frequenza</th>
                             <th v-if="item.body_impacted" class="text-left">
                                 Parte del corpo</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.trauma">{{item.trauma.name}} (Trauma)</td>
                        <td v-if="item.disease">{{item.diseaseRegister.name}} (Patologia)</td>
                        <td v-if="item.allergyRegister">{{item.allergyRegister.name}}
                            (Allergia)</td>
                        <td v-if="item.intervention">{{item.intervention.name}} (Intervento)</td>
                        <td v-if="item.dosage">{{item.dosage}}</td>
                        <td v-if="item.unit">{{item.unit}}</td>
                        <td v-if="item.daily_frequency">{{item.daily_frequency}}</td>
                        <td v-if="item.body_impacted">
                            {{item.body_impacted}}</td>
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
  name: 'Medicines',
  components: { AutocompleteSearch },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchMedicines() {
      const userMedicine = await db.medicines
        .where({ id_person: this.$store.state.user.id }).toArray();
      const medicineIds = [...new Set(userMedicine.map((item) => item.id_medicine))];
      const medicineRegister = await db.medicine_register.bulkGet(medicineIds);
      const keyedMedicineDefinitions = keyBy(medicineRegister, 'id');

      const userInterventions = await db.interventions
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedInterventionDefinitions = keyBy(userInterventions, 'id_care');
      const interventionRegister = await db.intervention_register.toArray();
      const keyedInterventionRegisterDefinitions = keyBy(interventionRegister, 'id');

      const userTraumas = await db.traumas
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedTraumaDefinitions = keyBy(userTraumas, 'id_trauma');
      const userDiseases = await db.diseases
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedDiseaseDefinitions = keyBy(userDiseases, 'id_care');
      const diseaseRegister = await db.disease_register.toArray();
      const keyedDiseaseRegisterDefinitions = keyBy(diseaseRegister, 'id');

      const userAllergies = await db.allergies
        .where({ id_person: this.$store.state.user.id }).toArray();
      const keyedAllergyDefinitions = keyBy(userAllergies, 'id_care');
      const allergyRegister = await db.allergy_register.toArray();
      const keyedAllergyRegisterDefinitions = keyBy(allergyRegister, 'id');

      this.items = userMedicine.map((item) => ({
        ...item,
        medicine: keyedMedicineDefinitions[item.id_medicine],
        trauma: keyedTraumaDefinitions[item.id_trauma],
        disease: keyedDiseaseDefinitions[item.id_disease],
        diseaseRegister:
        keyedDiseaseRegisterDefinitions[
            keyedDiseaseDefinitions[item.id_disease]?.id_disease ?? 0],
        allergyRegister:
        keyedAllergyRegisterDefinitions[
            keyedAllergyDefinitions[item.id_allergy]?.id_allergy ?? 0],
        intervention: keyedInterventionRegisterDefinitions[
            keyedInterventionDefinitions[item.id_intervention]?.id_intervention ?? 0],

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
    this.fetchMedicines();
  },
};
</script>
