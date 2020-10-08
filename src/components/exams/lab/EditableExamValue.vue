<template>
  <tr :class="exam.highlight ?'font-weight-bold':''" v-if="!editing">
    <td class="text-capitalize">{{ (def ? def.name : '').toLowerCase() }}</td>
    <td>{{ exam.value }}</td>
    <td>{{ exam.unit }}</td>
    <td class="text-right" colspan="2">
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-2" @click="editing=true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="teal" fab x-small dark elevation="0" class="mr-2">
        <v-icon>mdi-chart-line</v-icon>
      </v-btn>
      <v-btn color="error" fab x-small dark elevation="0">
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
        :filters="[(a) => a.category === category]"
        v-on:change="updateExam"
        :initial-value="def"
      />
    </td>
    <td class="pa-0 px-2">
      <v-text-field label="Valore" v-model="exam.value" type="number"/>
    </td>
    <td class="pa-0 px-2">
      <v-select :items="units" v-model="exam.unit" label="Unità Di Misura"/>
    </td>
    <td>
      <v-checkbox v-model="exam.highlight" label="Segnalato"/>
    </td>
    <td class="text-right">
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-0" @click="save()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/home/AutocompleteSearch.vue';

export default {
  name: 'EditableExamValue',
  components: { AutocompleteSearch },
  props: {
    item: null,
    category: null,
    units: null,
    parent: null,
  },
  methods: {
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
