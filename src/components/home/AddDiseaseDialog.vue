<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
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
        <span class="headline">Aggiungi Diagnosi</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <AutocompleteSearch
            invalid-hint="Seleziona Diagnosi"
            label="Diagnosi"
            :required="true"
            :table="table"
            v-on:change="disease = $event"/>
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
                    :value="fromDateText"
                    label="Data Diagnosi *"
                    class="capitalized"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => !!v || 'Aggiungi Data Diagnosi']"/>
                </template>
                <v-date-picker v-model="from" @input="fromDialog = false" locale="it"/>
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
                    label="Data Guarigione"
                    class="capitalized"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-date-picker v-model="to" @input="toDialog = false" locale="it"/>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">
              <v-checkbox v-model="chronic" label="Malattia Cronica"/>
            </v-col>
            <v-col md="8">
              <v-text-field prepend-icon="mdi-human" v-model="body_impacted"
                label="Parte Del Corpo Interessata"/>
            </v-col>
          </v-row>
          <v-textarea
            class="mt-5"
            outlined
            rows="3"
            placeholder="Note"
            label="Note"
            v-model="note"/>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-btn color="error" @click="cancel">Annulla</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save" :disabled="!valid">Salva</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'AddDiseaseDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
  },
  data() {
    return {
      table: db.disease_register,
      dialog: false,
      fromDialog: false,
      toDialog: false,
      valid: false,
      from: null,
      to: null,
      body_impacted: null,
      chronic: false,
      note: null,
      disease: null,
    };
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
    reset() {
      this.dialog = false;
      this.fromDialog = false;
      this.toDialog = false;
      this.valid = false;
      this.$refs.form.reset();
      this.from = null;
      this.to = null;
      this.body_impacted = null;
      this.chronic = false;
      this.note = null;
      this.disease = null;
    },
    async save() {
      await db.diseases
        .put({
          id_person: this.user.id,
          id_disease: this.disease.id,
          chronic: this.chronic,
          body_impacted: this.body_impacted,
          from: this.from,
          to: this.to,
          note: this.note,
          creation: moment().format(),
          update: moment().format(),
        });
      this.reset();
      if (this.onAdd) {
        this.onAdd();
      }
    },
    cancel() {
      this.reset();
    },
  },
};
</script>

<style scoped>

</style>
