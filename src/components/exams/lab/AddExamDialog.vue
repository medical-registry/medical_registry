<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <div class="my-5 light-blue--text">
        <v-btn class="mx-2"
               color="primary lighten-1"
               dark
               v-bind="attrs"
               v-on="on">
          Aggiungi Esame
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title>Aggiungi Esame</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            prepend-icon="mdi-help-circle-outline"
            v-model="exam.diagnostic_question"
            label="Quesito Diagnostico"
            :rules="[v => !!v && v.length > 0 || 'Inserisci Quesito Diagnostico']"/>
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
                    :value="dateRangeText"
                    label="Date"
                    hint="Data o intervallo di date in cui l'esame é stato eseguito"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[v => !!v && v.length > 0 || 'Data']"/>
                </template>
                <v-date-picker
                  :min="dateRange && dateRange[0]"
                  range
                  no-title
                  v-model="dateRange"
                  @change="handleSelection"
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
                  hint="Ore a cui é stato eseguto l'esame"
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
          <AutocompleteSearch
            invalid-hint="Seleziona Farmaco"
            label="Tipologia Esame"
            :required="true"
            :table="database.exam_register"
            :filters="[filterExamsByCategory]"
            v-on:change="exam.def = $event"/>
          <v-row style="padding: 0 35px;">
            <v-col md4 class="py-0">
              <v-text-field md4 label="Valore" v-model="exam.value" type="number"/>
            </v-col>
            <v-col md4 class="py-0">
              <v-select md4 :items="units" v-model="exam.unit" label="Unità Di Misura"/>
            </v-col>
            <v-col md4 class="py-0">
              <v-checkbox md4 v-model="exam.highlight" label="Segnalato"/>
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
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import AutocompleteSearch from '@/components/home/AutocompleteSearch.vue';

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
  highlight: true,
  value: null,
  unit: null,
};

export default {
  name: 'AddExamDialog',
  components: { AutocompleteSearch },
  props: {
    macro_category: null,
    category: null,
    user_id: null,
    units: null,
  },
  computed: {
    dateRangeText() {
      if (this.dateRange && this.dateRange.length === 1) {
        return moment(this.dateRange[0]).format('LL');
      }
      if (this.dateRange && this.dateRange.length === 2) {
        return `Dal ${moment(this.dateRange[0]).format('LL')} Al ${moment(this.dateRange[1]).format('LL')}`;
      }
      return '';
    },
  },
  methods: {
    filterExamsByCategory(item) {
      return item.macro_category === this.macro_category && item.category === this.category;
    },
    handleSelection() {
      console.log(this.dateRange);
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
  },
  data() {
    return {
      database: db,
      dialog: false,
      timePicker: false,
      valid: false,
      dateDialog: false,
      dateRange: null,
      exam: { ...model, id_person: this.user_id },
    };
  },
};
</script>

<style scoped>

</style>
