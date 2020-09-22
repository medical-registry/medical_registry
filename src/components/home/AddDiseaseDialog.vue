<template>
  <v-dialog v-model="dialog" max-width="600px">
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
            v-on:change="disease = $event"
          />
          <v-menu
            v-model="fromDialog"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="from"
                label="Data Diagnosi"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[v => !!v || 'Aggiungi Data Diagnosi']"/>
            </template>
            <v-date-picker v-model="from" @input="fromDialog = false"/>
          </v-menu>
          <v-menu
            v-model="toDialog"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="to"
                label="Data Guarigione"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"/>
            </template>
            <v-date-picker v-model="to" @input="toDialog = false"/>
          </v-menu>
          <v-checkbox
            v-model="chronic"
            label="Malattia Cronica"/>
          <v-text-field
            v-model="body_impacted"
            label="Parte Del Corpo Interessata"
          />
          <v-textarea
            class="mt-5"
            outlined
            placeholder="Note"
            label="Note"
            v-model="note"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1"
               text
               @click="save"
               :disabled="!valid">
          Salva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import AutocompleteSearch from '@/components/home/AutocompleteSearch.vue';

export default {
  name: 'AddDiseaseDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
  },
  data: () => ({
    valid: false,
    fromDialog: false,
    toDialog: false,
    dialog: false,
    body_impacted: null,
    from: null,
    to: null,
    chronic: false,
    note: null,
    table: db.disease_register,
    disease: null,
  }),

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    save() {
      db.diseases.get({
        id_person: this.user.id,
        id_disease: this.disease.id,
        from: this.from,
      })
        .then((o) => {
          if (o) {
            return Promise.reject(new Error('present'));
          }
          return db.diseases
            .add({
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
        })
        .then(() => {
          this.$refs.form.reset();
          this.dialog = false;
          if (this.onAdd) {
            this.onAdd();
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
  },
};
</script>

<style scoped>

</style>
