<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-chip v-if="editingRecord"
              v-bind="attrs"
              v-on="on"
              class="mr-3 text-capitalize font-weight-bold"
              style="white-space: pre-wrap;"
              :color="color"
              :text-color="textColor">
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
    <v-card v-if="record">
      <v-card-title>
        <span class="headline">Aggiungi Allergia</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :initial-value="def"
            :required="true"
            :table="table"
            v-on:change="updateDef"/>
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
                <v-date-picker v-model="record.from" no-title
                               @input="fromDialog = false" locale="it-it"/>
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
                    clearable
                    @click:clear="record.to = null"
                    class="capitalized"
                    label="Data guarigione"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-date-picker v-model="record.to" no-title
                               :min="record.from"
                               @input="toDialog = false" locale="it-it" />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">
              <v-checkbox v-model="record.intolerance" label="Intolleranza"/>
            </v-col>
            <v-col md="8">
              <v-select
                v-model="record.severity"
                :items="['BASSA', 'MEDIA', 'ALTA']"
                :rules="[v => !!v || 'Selezione Intensità']"
                label="Intensità *"/>
            </v-col>
          </v-row>
          <v-textarea
            class="mt-5" rows="3" outlined
            placeholder="Note" label="Note"
            v-model="record.note"/>
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
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

const defaultRecord = {
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
    return {
      table: db.allergy_register,
      valid: !!this.editingRecord,
      fromDialog: false,
      toDialog: false,
      dialog: false,
      def: this.editingRecord ? this.editingRecord.def : null,
      record: this.editingRecord ? { ...this.editingRecord }
        : { ...defaultRecord, id_person: this.userId },
    };
  },
  computed: {
    color() {
      if (!this.editingRecord) return '';
      if (this.editingRecord.to && this.editingRecord.to !== '') {
        return 'gray';
      }
      switch (this.editingRecord.severity) {
        case 'BASSA': return 'yellow darken-2';
        case 'MEDIA': return 'orange darken-2';
        case 'ALTA': return 'deep-orange darken-2';
        default: return 'gray';
      }
    },
    textColor() {
      return this.editingRecord && this.editingRecord.to ? 'black' : 'white';
    },
    fromDateText() {
      if (!this.record || !this.record.from) return '';
      return moment(this.record.from).format('LL');
    },
    toDateText() {
      if (!this.record || !this.record.to) return '';
      return moment(this.record.to).format('LL');
    },
  },
  methods: {
    updateDef(newDef) {
      this.def = newDef;
      this.record.id_allergy = newDef.id;
    },
    reset() {
      this.valid = !!this.editingRecord;
      this.fromDialog = false;
      this.toDialog = false;
      this.def = this.editingRecord ? this.editingRecord.def : null;
      // this.record = this.editingRecord ? { ...this.editingRecord } : { ...defaultRecord };
      if (!this.editingRecord) {
        this.$refs.form.reset();
      }
    },
    async save() {
      if (this.record.to === '') {
        delete this.record.to;
      }
      await db.allergies.put(this.record);
      this.reset();
      this.$emit('change');
      this.dialog = false;
    },
    cancel() {
      this.reset();
      this.dialog = false;
    },
  },
};
</script>

<style scoped>

</style>
