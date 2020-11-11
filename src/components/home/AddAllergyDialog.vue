<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-chip v-if="editingRecord"
              v-bind="attrs"
              v-on="on"
              class="mr-3 text-capitalize font-weight-bold"
              style="white-space: pre-wrap;"
              :color="editingRecord.color"
              :text-color="editingRecord.textColor">
        {{editingRecord.def.name.toLowerCase()}}
        <span v-if="editingRecord.intolerance">(intolleranza)</span>
      </v-chip>
      <v-btn v-else class="mx-2"
             fab
             small
             color="primary lighten-1"
             dark
             v-bind="attrs"
             v-on="on">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Aggiungi Allergia</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :initial-value="record.def"
            :required="true"
            :table="table"
            v-on:change="updateDef"
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
                v-model="record.from"
                label="Data Diagnosi"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[v => !!v || 'Aggiungi Data Diagnosi']"/>
            </template>
            <v-date-picker v-model="record.from" @input="fromDialog = false" locale="it"/>
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
                v-model="record.to"
                clearable
                label="Data guarigione"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"/>
            </template>
            <v-date-picker v-model="record.to" @input="toDialog = false" locale="it"/>
          </v-menu>
          <v-checkbox
            v-model="record.intolerance"
            label="Intolleranza"/>
          <v-select
            v-model="record.severity"
            :items="['BASSA', 'MEDIA', 'ALTA']"
            :rules="[v => !!v || 'Selezione Intensità']"
            label="Intensità"
          />
          <v-textarea
            class="mt-5"
            outlined
            placeholder="Note"
            label="Note"
            v-model="record.note"/>
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
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

const defaultRecord = {
  dialog: false,
  id_allergy: null,
  severity: null,
  intolerance: null,
  from: null,
  to: null,
  note: null,
  allergy: null,
};

export default {
  name: 'AddAllergyDialog',
  components: { AutocompleteSearch },
  props: {
    onAdd: null,
    userId: null,
    editingRecord: null,
  },
  data() {
    let record = defaultRecord;
    if (this.editingRecord) {
      record = { ...this.editingRecord };
    }
    return {
      table: db.allergy_register,
      valid: false,
      fromDialog: false,
      toDialog: false,
      dialog: false,
      record,
    };
  },
  methods: {
    updateDef(newDef) {
      this.record.def = newDef;
    },
    async save() {
      const newRecord = {
        id_person: this.userId,
        id_allergy: this.record.def.id,
        severity: this.record.severity,
        intolerance: this.record.intolerance,
        from: this.record.from,
        to: this.record.to,
        note: this.record.note,
        creation: this.record ? this.record.creation : moment().format(),
        update: moment().format(),
      };
      if (this.editingRecord) {
        newRecord.id_care = this.editingRecord.id_care;
      }
      await db.allergies.put(newRecord);
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
