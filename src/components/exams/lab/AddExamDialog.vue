<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
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
                    label="Date"
                    hint="Intervallo di date in cui l'esame é stato eseguito"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => interval && !!v || 'Seleziona intervallo']"/>
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
            <v-col v-if="!interval" md="7">
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
                    label="Data"
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
          <AutocompleteSearch
            invalid-hint="Seleziona Esame"
            label="Tipologia Esame"
            :required="true"
            :table="database.exam_register"
            :filters="[
              (a) => macro_category === 'LABORATORIO ALTRO' ?
                a.category === category :
                a.macro_category === macro_category
            ]"
            v-on:change="setExamId"
            :default-creation-values="{category, macro_category}"/>
          <v-row>
            <v-col class="pa-0 px-2">
              <v-checkbox v-model="exam.highlight" label="Segnalato"/>
            </v-col>
            <v-col class="pa-0 px-2">
              <v-text-field label="Valore" v-model="exam.value" type="number"
                            :rules="[v => !!v || 'Aggiungi Valore']"/>
            </v-col>
            <v-col class="pa-0 px-2">
              <v-select :items="units" v-model="exam.unit"
                        label="Unità Di Misura"
                        :rules="[v => !!v || 'Aggiungi Unità Di Misura']"/>
            </v-col>
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
        <v-btn color="primary" @click="save" :disabled="!valid">
          Salva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

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
  name: 'AddExamDialog',
  components: { AutocompleteSearch },
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
  methods: {
    setExamId(value) {
      if (value) {
        this.exam.id_exam = value.id;
      }
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
      singleDateDialog: false,
      singleDate: null,
      exam: { ...model, id_person: this.user_id },
    };
  },
};
</script>

<style scoped>

</style>
