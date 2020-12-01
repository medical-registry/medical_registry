<template>
  <tr :class="exam.highlight ?'font-weight-bold':''" v-if="!editing">
    <td class="text-capitalize py-5 pl-0">{{ (def ? def.name : '').toLowerCase() }}</td>
    <td class="py-20">{{ exam.value }}</td>
    <td class="py-26">{{ exam.unit }}</td>
    <td class="text-right py-5" colspan="2">
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-2" @click="editing=true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <ValueChartDialog
        :exam-id="exam.def.id"
        :exam-name="def.name"
        :person-id="parent.id_person"/>
      <v-btn color="error" fab x-small dark elevation="0" @click="deleteExam">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </td>
  </tr>
  <tr v-else>
    <td class="pa-0 px-2">
      <AutocompleteSearch
        invalid-hint="Seleziona Esame"
        label="Tipologia Esame"
        :required="true"
        :table="database.exam_register"
        :filters="[(a) => a.category === this.category]"
        v-on:change="updateExamDef"
        :initial-value="def"
        :default-creation-values="{category, macro_category}"
      />
    </td>
    <td class="pa-0 px-2">
      <v-text-field label="Valore" v-model="exam.value"/>
    </td>
    <td class="pa-0 px-2">
      <v-select :items="units" v-model="exam.unit" label="Unità Di Misura"/>
    </td>
    <td>
      <v-checkbox v-model="exam.highlight" label="Segnalato"/>
    </td>
    <td class="text-right">
      <v-btn color="error" fab x-small dark elevation="0" @click="editing = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-0 ml-3" @click="save()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';
import ValueChartDialog from '@/components/exams/lab/ValueChartDialog.vue';

const baseModel = {
  highlight: false,
  id_exam_type: null,
  unit: null,
  value: null,
};

export default {
  name: 'EditableExamValue',
  components: { ValueChartDialog, AutocompleteSearch },
  props: {
    item: null,
    parent: null,
    units: null,
  },
  methods: {
    async deleteExam() {
      await this.database.exam_values.where({ id: this.item.id }).delete();
      this.$emit('delete');
    },
    async save() {
      this.exam.update = moment().format();
      if (!this.item) {
        this.exam.creation = moment().format();
      }
      await this.database.exam_values.put(this.exam);
      this.editing = false;
      this.$emit('update');
    },
    updateExamDef(def) {
      if (!def) { return; }
      this.def = def;
      this.exam.id_exam_type = def.id;
    },
  },
  data() {
    let data;
    if (!this.item) {
      data = { ...baseModel, id_exam: this.parent.id_care };
    } else {
      data = { ...this.item };
    }
    return {
      editing: !this.item,
      def: this.item ? this.item.def : null,
      category: this.parent.category,
      macro_category: this.parent.macro_category,
      database: db,
      exam: data,
    };
  },
};
</script>

<style scoped>

</style>
