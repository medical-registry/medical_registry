<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="!editing" color="primary lighten-1" dark v-bind="attrs" v-on="on">
        Aggiungi Esame
      </v-btn>
      <v-btn v-else color="primary" fab x-small dark elevation="0"
             class="mr-2" v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title v-if="!editing">Aggiungi Esame</v-card-title>
      <v-card-title v-else>Aggiorna Esame</v-card-title>
      <v-form ref="form" v-model="valid">
        <v-card-text>
          <v-select v-if="examsTypes && !editing"
            :items="examsTypes"
            required
            item-text="name"
            item-value="id"
            label="Tipologia Esame *"
            v-model="exam.id_exam"
            :rules="[v => !!v || 'Seleziona Tipologia esame']"
            prepend-icon="mdi-magnify"/>
          <v-text-field
            prepend-icon="mdi-help-circle-outline"
            v-model="exam.diagnostic_question"
            label="Quesito Diagnostico *"
            :rules="[v => !!v && v.length > 0 || 'Inserisci Quesito Diagnostico']"
            required/>
          <v-text-field
            prepend-icon="mdi-clipboard-check-multiple-outline"
            v-model="exam.requisites"
            hint="Esempio: Digiuno"
            label="Requisiti"/>
          <v-row>
            <v-col md="2">
              <v-checkbox v-model="interval" label="Intervallo" @change="resetDates()"/>
            </v-col>
            <v-col v-if="interval" md="10">
              <v-menu md10 xl10 v-model="dateDialog"
                      :close-on-content-click="false"
                      :nudge-right="30"
                      transition="scale-transition"
                      min-width="290px"
                      offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field class="capitalized"
                    :value="dateRangeText"
                    label="Date *"
                    hint="Intervallo di date in cui l'esame é stato eseguito"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => !!v || 'Seleziona intervallo']"/>
                </template>
                <v-date-picker
                  :min="dateRange && dateRange[0]"
                  range
                  no-title
                  v-model="dateRange"
                  @change="handleSelection"
                  locale="it-it"/>
              </v-menu>
            </v-col>
            <v-col v-else md="7">
              <v-menu
                v-model="singleDateDialog"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field class="capitalized"
                    :value="singleDateText"
                    label="Data *"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => !interval && !!v || 'Seleziona Data']"/>
                </template>
                <v-date-picker
                  v-model="singleDate"
                  no-title
                  @change="handleSelection"
                  locale="it-it"/>
              </v-menu>
            </v-col>
            <v-col md="3" v-if="!interval">
              <v-menu ref="menu"
                      v-model="timePicker"
                      :close-on-content-click="false"
                      :nudge-right="30"
                      :return-value.sync="timePicker"
                      transition="scale-transition"
                      offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="exam.time"
                    label="Ora"
                    hint="Ore a cui é stato eseguito l'esame"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-time-picker
                  v-if="timePicker"
                  v-model="exam.time"
                  full-width
                  format="24hr"
                  no-title
                  @click:minute="$refs.menu.save(exam.time)"/>
              </v-menu>
            </v-col>
          </v-row>
          <v-textarea v-if="macro_category !== 'LABORATORIO ALTRO'"
            class="mt-5"
            outlined
            placeholder="Note"
            label="Note"
            v-model="exam.note"/>
          <v-textarea v-else
            class="mt-5"
            outlined
            placeholder="Esito"
            label="Esito *"
            v-model="exam.note"
            :rules="[v => !!v || 'Aggiungi Esito']"/>
      </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn color="error" @click="cancel">Annulla</v-btn>
          <v-spacer/>
          <v-btn color="primary" @click="save" :disabled="!valid">Salva</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';

const model = {
  diagnostic_question: null,
  note: null,
  body_impacted: null,
  from: null,
  to: null,
  id_exam: null,
  time: null,
  id_location: null,
  id_doctor: null,
  requisites: null,
  receipit_code: null,
};

export default {
  name: 'AddNonLabExamDialog',
  components: { },
  props: {
    macro_category: null,
    category: null,
    user_id: null,
    units: null,
    initialValue: null,
    editing: {
      type: Boolean,
      default: false,
    },
    addButtonAlign: {
      type: String,
      default: 'text-left',
    },
  },
  computed: {
    dateRangeText() {
      if (!this.dateRange || this.dateRange.length < 2) {
        return null;
      }
      const [from, to] = this.dateRange;
      return `Dal ${moment(from).format('LL')} Al ${moment(to).format('LL')}`;
    },
    singleDateText() {
      if (!this.singleDate) {
        return null;
      }
      return moment(this.singleDate).format('LL');
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    handleCategoryChange() {
      this.def = null;
      if (this.$refs.searchExamDef) {
        this.$refs.searchExamDef.reset();
      }
    },
    cancel() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    updateExamDef(def) {
      if (!def) { return; }
      this.def = def;
      this.exam.id_exam = def.id;
    },
    resetDates() {
      this.dateDialog = false;
      this.timePicker = false;
      this.singleDateDialog = false;
      this.exam.from = null;
      this.exam.to = null;
      this.exam.time = null;
      this.dateRange = null;
      this.singleDate = null;
    },
    handleSelection() {
      if (this.interval) {
        this.dateDialog = false;
        const [from, to] = this.dateRange;
        this.exam.from = from;
        this.exam.to = to;
      } else {
        this.singleDateDialog = false;
        this.exam.from = this.singleDate;
        this.exam.to = null;
      }
    },
    reset() {
      this.dialog = false;
      this.dateDialog = false;
      this.dateRange = null;
      this.timePicker = false;
      this.valid = false;
      this.resetDates();
      this.$refs.form.reset();
      this.exam = this.buildFormValues();
    },
    async save() {
      const id = await this.database.exams.put(this.exam);
      const res = await this.database.exams.get(id);
      if (this.editing) {
        this.$emit('updated', res);
        this.$refs.form.reset();
        this.dialog = false;
      } else {
        this.$emit('created', res);
        this.reset();
      }
    },
    buildFormValues() {
      let formValues = {
        ...model,
        id_person: this.user_id,
        category: this.category,
        macro_category: this.macro_category,
      };
      if (this.editing && this.initialValue) {
        formValues = { ...this.initialValue };
      }
      return formValues;
    },
    async fetchCategories() {
      this.examsTypes = await db.exam_register
        .where({ macro_category: this.macro_category, category: this.category })
        .toArray();
      this.examsTypes.sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  data() {
    const formValues = this.buildFormValues();
    return {
      def: this.editing ? this.initialValue.def : null,
      database: db,
      dialog: false,
      timePicker: false,
      valid: false,
      dateDialog: false,
      dateRange: this.editing && formValues.to ? [formValues.from, formValues.to] : null,
      interval: !!(this.editing && formValues.to),
      singleDateDialog: false,
      singleDate: this.editing && !formValues.to ? formValues.from : null,
      exam: formValues,
      examsTypes: null,
    };
  },
};
</script>

<style scoped>

</style>
