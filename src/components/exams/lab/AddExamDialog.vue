<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-container :class="`my-0 mt-5 light-blue--text ${addButtonAlign}`">
        <v-btn color="primary lighten-1" dark v-bind="attrs" v-on="on">
          Aggiungi Esame
        </v-btn>
      </v-container>
    </template>
    <v-card>
      <v-card-title>Aggiungi Esame</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            prepend-icon="mdi-help-circle-outline"
            v-model="exam.diagnostic_question"
            label="Quesito Diagnostico"
            :rules="[v => !!v && v.length > 0 || 'Inserisci Quesito Diagnostico']"
            required/>
          <v-text-field
            prepend-icon="mdi-clipboard-check-multiple-outline"
            v-model="exam.requisites"
            hint="Esempio: Digiuno"
            label="Requisiti"/>
          <v-checkbox v-model="interval" label="Intervallo"/>
          <v-row class="px-3">
            <v-menu md10 xl10
              v-model="dateDialog"
              :close-on-content-click="false"
              :nudge-right="30"
              transition="scale-transition"
              min-width="290px"
              offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="capitalized"
                    :value="interval? dateRangeText: singleDateText"
                    label="Date"
                    hint="Data o intervallo in cui l'esame é stato eseguito"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => !!v && v.length > 0 || 'Data']"/>
                </template>
                <v-date-picker
                  v-if="interval"
                  :min="dateRange && dateRange[0]"
                  range
                  no-title
                  v-model="dateRange"
                  @change="handleSelection"
                  locale="it-it"/>
              <v-date-picker
                v-else
                no-title
                v-model="exam.from"
                locale="it-it"/>
            </v-menu>
            <v-menu v-if="dateRange && dateRange.length === 1" md2 xl2
              ref="menu"
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
          </v-row>
          <v-textarea
            class="mt-5"
            outlined
            placeholder="Note"
            label="Note"
            v-model="exam.note"/>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-btn color="error" @click="dialog = false">
          Annulla
        </v-btn>
        <v-spacer/>
        <v-btn color="primary" @click="save" :disabled="valid">
          Salva
        </v-btn>
      </v-card-actions>
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
  time: null,
  id_location: null,
  id_doctor: null,
  requisites: null,
  receipit_code: null,
};

export default {
  name: 'AddExamDialog',
  props: {
    macro_category: null,
    category: null,
    user_id: null,
    units: null,
    addButtonAlign: {
      type: String,
      default: 'text-left',
    },
  },
  computed: {
    dateRangeText() {
      if (this.dateRange && this.dateRange.type === String) {
        return moment(this.dateRange[0]).format('LL');
      }
      if (this.dateRange && this.dateRange.length === 2) {
        return `Dal ${moment(this.dateRange[0]).format('LL')} Al ${moment(this.dateRange[1]).format('LL')}`;
      }
      return '';
    },
    singleDateText() {
      if (this.exam.from) {
        return moment(this.dateRange[0]).format('LL');
      }
      return '';
    },
  },
  methods: {
    handleSelection() {
      if (this.dateRange && this.dateRange.length > 0 && this.dateRange[0] === this.dateRange[1]) {
        this.dateRange = null;
        this.exam.from = null;
        this.exam.to = null;
        return;
      }
      const [from, to] = this.dateRange;
      this.exam.from = from;
      this.exam.to = to;
    },
    reset() {
      this.dialog = false;
      this.dateDialog = false;
      this.dateRange = null;
      this.timePicker = false;
      this.valid = false;
      this.exam = { ...model, id_person: this.user_id };
    },
    async save() {
      const id = await this.database.exams.put(this.exam);
      const res = await this.database.exams.get(id);
      this.$emit('created', res);
      this.reset();
    },
  },
  data() {
    return {
      database: db,
      dialog: false,
      timePicker: false,
      valid: false,
      dateDialog: false,
      dateRange: null,
      interval: false,
      exam: { ...model, id_person: this.user_id },
    };
  },
};
</script>

<style scoped>

</style>
