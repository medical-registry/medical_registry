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
        <span class="headline">Aggiungi Allergia</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :required="true"
            :table="table"
            v-on:change="allergy = $event"
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
                label="Data guarigione"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"/>
            </template>
            <v-date-picker v-model="to" @input="toDialog = false"/>
          </v-menu>
          <v-checkbox
            v-model="intolerance"
            label="Intolleranza"/>
          <v-select
            v-model="severity"
            :items="['BASSA', 'MEDIA', 'ALTA']"
            :rules="[v => !!v || 'Selezione Intensità']"
            label="Intensità"
            required
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
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/home/AutocompleteSearch.vue';

export default {
  name: 'AddAllergyDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
  },
  data: () => ({
    table: db.allergy_register,
    valid: false,
    fromDialog: false,
    toDialog: false,
    dialog: false,
    id_allergy: null,
    severity: null,
    intolerance: null,
    from: null,
    to: null,
    note: null,
    allergy: null,
  }),

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    save() {
      db.allergies.get({
        id_person: this.user.id,
        id_allergy: this.allergy.id,
        from: this.from,
      })
        .then((o) => {
          if (o) {
            return Promise.reject(new Error('present'));
          }
          return db.allergies
            .add({
              id_person: this.user.id,
              id_allergy: this.allergy.id,
              severity: this.severity,
              intolerance: this.intolerance,
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
