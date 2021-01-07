<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <div class="my-5 light-blue--text">
        <v-btn class="mx-2"
               fab
               color="primary lighten-1"
               dark
               v-bind="attrs"
               v-on="on">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Aggiungi Prescrizione</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-select
            :items="reasons"
            item-text="name"
            item-value="value"
            label="Motivo delle Prescrizione"
            v-model="reason"
            @change="resetReason"
            :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
            prepend-icon="mdi-help-circle-outline"/>
          <div v-if="reason">
            <v-combobox
              v-if="reason === 'allergy'"
              v-model="allergy"
              :items="allergyList"
              label="Allergia"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-asterisk"/>
            <v-combobox
              v-if="reason === 'trauma'"
              v-model="trauma"
              :items="traumaList"
              label="Trauma"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-bandage"/>
            <v-combobox
              v-if="reason === 'intervention'"
              v-model="intervention"
              :items="interventionList"
              label="Intervento"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-hospital-building"/>
            <v-combobox
              v-if="reason === 'disease'"
              v-model="disease"
              :items="diseaseList"
              label="Diagnosi"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-clipboard-plus-outline"/>
          </div>
          <div v-if="disease || allergy || intervention || trauma">
            <AutocompleteSearch
              label="Farmaco"
              :rules="[v => !!v || 'Seleziona Farmaco']"
              required
              :table="database.medicine_register"
              v-on:change="drug = $event"/>
            <v-row>
              <v-col md="6">
                <v-select
                  :items="frequencyList"
                  item-text="value"
                  label="Frequenza *"
                  :rules="[v => !!v || 'Seleziona Frequenza']"
                  v-model="daily_frequency"
                  prepend-icon="mdi-history"
                  required/>
              </v-col>
              <v-col md="6">
                <v-text-field prepend-icon="mdi-human" v-model="body_impacted"
                              label="Parte del corpo interessata"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-menu
                  v-model="fromDialog"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="text-capitalize"
                      :value="fromDateText"
                      label="Inizio *"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[v => !!v || 'Aggiungi Data Inizio Prescrizione']"/>
                  </template>
                  <v-date-picker v-model="from" @input="fromDialog = false" locale="it"/>
                </v-menu>
              </v-col>
              <v-col md="6">
                <v-menu
                  class="text-capitalize"
                  v-model="toDialog"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="toDateText"
                      label="Fine"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"/>
                  </template>
                  <v-date-picker v-model="to" @input="toDialog = false" locale="it"/>
                </v-menu>
              </v-col>
            </v-row>
            <v-textarea
              class="mt-5"
              rows="2"
              outlined
              placeholder="Note"
              label="Note"
              v-model="note"/>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" text @click="cancel" >
          Annulla
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save" :disabled="!valid">
          Salva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '@/services/database';
import moment from 'moment';
import { keyBy } from '@/services/util';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

const reasons = [
  { name: 'Diagnosi', value: 'disease' },
  { name: 'Trauma', value: 'trauma' },
  { name: 'Intervento', value: 'intervention' },
  { name: 'Allergia', value: 'allergy' },
];
export default {
  name: 'AddPrescriptionDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
  },
  data: () => ({
    reasons,
    valid: false,
    dialog: false,
    fromDialog: false,
    toDialog: false,
    dosage: null,
    unit: null,
    body_impacted: null,
    daily_frequency: null,
    from: null,
    to: null,
    note: null,
    drug: null,
    disease: null,
    trauma: null,
    allergy: null,
    intervention: null,
    database: db,
    diseaseList: null,
    traumaList: null,
    allergyList: null,
    frequencyList: null,
    interventionList: null,
    reason: null,
  }),
  mounted() {
    db.choices.where('category')
      .equalsIgnoreCase('frequenza')
      .toArray()
      .then((res) => { this.frequencyList = res; });
    [
      {
        register: db.disease_register,
        field: 'id_disease',
        table: db.diseases,
        callback: (res) => { this.diseaseList = res; },
      },
      {
        table: db.traumas,
        callback: (res) => { this.traumaList = res; },
      },
      {
        register: db.allergy_register,
        field: 'id_allergy',
        table: db.allergies,
        callback: (res) => { this.allergyList = res; },
      },
      {
        register: db.intervention_register,
        field: 'id_intervention',
        table: db.interventions,
        callback: (res) => {
          this.interventionList = res;
        },
      },
    ].forEach(({
      table, callback, field, register,
    }) => {
      table
        .where('id_person')
        .equals(this.$store.state.user.id)
        .toArray()
        .then((res) => {
          if (register) {
            return register
              .where('id')
              .anyOf(res.map((item) => parseInt(item[field], 10)))
              .toArray()
              .then((defs) => ({ defs, res }));
          }
          return { res };
        })
        .then(({ defs, res }) => {
          if (defs) {
            const keyed = keyBy(defs, 'id');
            return res.map((item) => (
              {
                ...item,
                name: keyed[item[field]] ? keyed[item[field]].name : item.name,
              }
            ));
          }
          return res;
        })
        .then(callback);
    });
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    fromDateText() {
      if (!this.from) return '';
      return moment(this.from).format('LL');
    },
    toDateText() {
      if (!this.to) return '';
      return moment(this.to).format('LL');
    },
  },
  methods: {
    resetReason() {
      this.allergy = null;
      this.trauma = null;
      this.disease = null;
      this.intervention = null;
    },
    cancel() {
      this.dialog = false;
      this.resetReason();
      this.$refs.form.reset();
    },
    async save() {
      await db.medicines
        .put({
          id_person: this.user.id,
          id_medicine: this.drug.id,
          id_trauma: this.trauma ? this.trauma.id_trauma : null,
          id_disease: this.disease ? this.disease.id_care : null,
          id_intervention: this.intervention ? this.intervention.id_care : null,
          id_allergies: this.allergy ? this.allergy.id_care : null,
          daily_frequency: this.daily_frequency,
          dosage: this.dosage,
          unit: this.unit,
          body_impacted: this.body_impacted,
          note: this.note,
          from: this.from,
          to: this.to,
          creation: moment().format(),
          update: moment().format(),
        });
      this.$refs.form.reset();
      this.dialog = false;
      if (this.onAdd) {
        this.onAdd();
      }
    },
  },
};
</script>

<style scoped>

</style>
