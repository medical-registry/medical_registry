<template>
  <tr :class="exam.highlight ?'font-weight-bold':''"
      v-if="!editing" :key="exam.id_care">
    <td class="text-capitalize py-5">{{ (def ? def.name : '').toLowerCase() }}</td>
    <td class="py-20">{{ exam.value }}</td>
    <td class="py-26">{{ exam.unit }}</td>
    <td class="text-right py-5" colspan="2">
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-2" @click="editing=true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <ValueChartDialog :exam-id="exam.id_exam" :person-id="userId" :exam-name="def.name"/>
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
        v-on:change="updateExam"
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

export default {
  name: 'EditableExamValue',
  components: { ValueChartDialog, AutocompleteSearch },
  props: {
    item: null,
    category: null,
    units: null,
    parent: null,
    macro_category: null,
    userId: null,
  },
  methods: {
    async deleteExam() {
      await this.database.exams.where({ id_care: this.exam.id_care }).delete();
      this.$emit('delete');
    },
    async save() {
      if (this.parent) {
        this.exam.creation = moment().format();
      }
      this.exam.update = moment().format();
      if (this.exam.id_care) {
        await this.database.exams.update(this.exam.id_care, this.exam);
      } else {
        await this.database.exams.put(this.exam);
      }
      this.editing = false;
      this.$emit('update');
    },
    updateExam(def) {
      if (!def) { return; }
      this.def = def;
      this.exam.id_exam = def.id;
      this.exam.name = def.name;
    },
  },
  data() {
    let data;
    if (this.parent) {
      data = { ...this.parent };
      delete data.id_care;
      delete data.id_exam;
      delete data.highlight;
      delete data.unit;
      delete data.name;
      delete data.value;
    } else {
      data = { ...this.item };
    }
    delete data.exam;
    return {
      editing: this.parent !== undefined,
      def: this.item ? this.item.exam : null,
      database: db,
      exam: data,
    };
  },
};
</script>

<style scoped>

</style>
