<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <div class="my-5 mx-1 light-blue--text">
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
              v-model="model.allergy"
              :items="allergyList"
              label="Allergia"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-asterisk"/>
            <v-combobox
              v-if="reason === 'trauma'"
              v-model="model.trauma"
              :items="traumaList"
              label="Trauma"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-bandage"/>
            <v-combobox
              v-if="reason === 'intervention'"
              v-model="model.intervention"
              :items="interventionList"
              label="Intervento"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-hospital-building"/>
            <v-combobox
              v-if="reason === 'disease'"
              v-model="model.disease"
              :items="diseaseList"
              label="Diagnosi"
              item-text="name"
              :rules="[v => !!v || 'Seleziona Motivo Della Prescrizione']"
              prepend-icon="mdi-clipboard-plus-outline"/>
          </div>
          <div v-if="model.disease || model.allergy || model.intervention || model.trauma">
            <AutocompleteSearch
              label="Farmaco"
              :rules="[v => !!v || 'Seleziona Farmaco']"
              required
              :table="database.medicine_register"
              v-on:change="model.drug = $event"/>
            <v-row>
              <v-col md="6">
                <v-select
                  :items="frequencyList"
                  item-text="value"
                  label="Frequenza *"
                  :rules="[v => !!v || 'Seleziona Frequenza']"
                  v-model="model.daily_frequency"
                  prepend-icon="mdi-history"
                  required/>
              </v-col>
              <v-col md="6">
                <v-text-field prepend-icon="mdi-human" v-model="model.body_impacted"
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
                      class="capitalized"
                      :value="fromDateText"
                      label="Inizio *"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[v => !!v || 'Aggiungi Data Inizio Prescrizione']"/>
                  </template>
                  <v-date-picker v-model="model.from" @input="fromDialog = false" locale="it"/>
                </v-menu>
              </v-col>
              <v-col md="6">
                <v-menu
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
                      class="capitalized"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"/>
                  </template>
                  <v-date-picker v-model="model.to" @input="toDialog = false" locale="it"/>
                </v-menu>
              </v-col>
            </v-row>
            <v-textarea class="mt-5" rows="3" outlined placeholder="Note" label="Note"
              v-model="model.note"/>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-btn color="error" @click="cancel" >Annulla</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save" :disabled="!valid">Salva</v-btn>
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

const queries = [
  {
    register: db.disease_register,
    field: 'id_disease',
    table: db.diseases,
    result: 'diseaseList',
  },
  {
    table: db.traumas,
    result: 'traumaList',
  },
  {
    register: db.allergy_register,
    field: 'id_allergy',
    table: db.allergies,
    result: 'allergyList',
  },
  {
    register: db.intervention_register,
    field: 'id_intervention',
    table: db.interventions,
    result: 'interventionList',
  },
];

const baseModel = {
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
};

export default {
  name: 'AddPrescriptionDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
  },
  data() {
    return {
      reasons,
      reason: null,
      database: db,
      valid: false,
      dialog: false,
      fromDialog: false,
      toDialog: false,
      diseaseList: null,
      traumaList: null,
      allergyList: null,
      frequencyList: null,
      interventionList: null,
      model: { ...baseModel },
    };
  },
  mounted() {
    this.loadFrequencies();
    this.loadReasons();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    fromDateText() {
      if (!this.model.from) return '';
      return moment(this.model.from).format('LL');
    },
    toDateText() {
      if (!this.model.to) return '';
      return moment(this.model.to).format('LL');
    },
  },
  methods: {
    reset() {
      this.valid = false;
      this.$refs.form.reset();
      this.dialog = false;
      this.fromDialog = false;
      this.toDialog = false;
      this.diseaseList = null;
      this.traumaList = null;
      this.allergyList = null;
      this.interventionList = null;
      this.model = { ...baseModel };
      this.reason = null;
    },
    async resetReason() {
      await this.loadReasons();
      this.allergy = null;
      this.trauma = null;
      this.disease = null;
      this.intervention = null;
    },
    async loadFrequencies() {
      this.frequencyList = await db.choices.where('category')
        .equalsIgnoreCase('frequenza')
        .toArray();
    },
    async loadReasons() {
      queries.forEach(async ({
        table, result, field, register,
      }) => {
        let res = await table.where('id_person').equals(this.user.id).toArray();
        if (register) {
          const defs = await register.where('id')
            .anyOf(res.map((item) => parseInt(item[field], 10)))
            .toArray();
          const keyed = keyBy(defs, 'id');
          res = res.map((item) => ({
            ...item,
            name: keyed[item[field]] ? keyed[item[field]].name : item.name,
          }));
        }
        this[result] = res;
      });
    },
    cancel() {
      this.dialog = false;
      this.reset();
    },
    async save() {
      await db.medicines
        .put({
          id_person: this.user.id,
          id_medicine: this.model.drug.id,
          id_trauma: this.model.trauma ? this.model.trauma.id_trauma : null,
          id_disease: this.model.disease ? this.model.disease.id_care : null,
          id_intervention: this.model.intervention ? this.model.intervention.id_care : null,
          id_allergies: this.model.allergy ? this.model.allergy.id_care : null,
          daily_frequency: this.model.daily_frequency,
          dosage: this.model.dosage,
          unit: this.model.unit,
          body_impacted: this.model.body_impacted,
          note: this.model.note,
          from: this.model.from,
          to: this.model.to,
          creation: moment().format(),
          update: moment().format(),
        });
      this.reset();
      if (this.onAdd) {
        this.onAdd();
      }
    },
  },
};
</script>

<style scoped>

</style>
