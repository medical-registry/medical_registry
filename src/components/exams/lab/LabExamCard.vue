<template>
  <v-card elevation="0">
    <AddExamDialog
      v-if="units"
      :macro_category="macro_category"
      :category="category"
      :units="units"
      :user_id="userId"
      v-on:created="fetchExams"
      :addButtonAlign="timelineItems && timelineItems.length> 0 ? 'text-right' : 'text-center'"/>
    <v-container v-if="timelineItems && Object.keys(timelineItems).length>0">
      <v-timeline  align-top dense>
        <v-timeline-item v-for="group in timelineItems" :key="group.date" small>
          <v-card class="elevation-3">
            <v-card-title class="headline capitalized" v-if="!group.values[0].to">
              {{formatDate(group.values[0].from)}}
              {{group.values[0].time? group.values[0].time : ''}}
            </v-card-title>
            <v-card-title class="headline capitalized" v-else>
              Dal {{formatDate(group.values[0].from)}}
              al {{formatDate(group.values[0].to)}}
            </v-card-title>
            <v-card-text>
              <span class="capitalized" v-if="macro_category === 'LABORATORIO ALTRO'">
                {{group.values[0].exam.category}} <br/>
              </span>
              <span v-if="group.values[0].diagnostic_question">
                Quesito:
                <span  class="capitalized">
                  {{group.values[0].diagnostic_question.toLowerCase()}}
                </span>
              </span>
              <br/>
              <p v-if="group.values[0].note">
                <b>Note</b> <br/>
                <span>
                  {{group.values[0].note}}
                </span>
              </p>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Esame</th>
                      <th class="text-left">Valore</th>
                      <th class="text-left">Unità</th>
                      <th colspan="2"/>
                    </tr>
                  </thead>
                  <tbody>
                    <EditableExamValue
                      v-for="item in group.values"
                      :key="item.id_care"
                      :units="units"
                      :category="category"
                      :macro_category="macro_category"
                      v-on:delete="fetchExams"
                      :item="item"
                      :user-id="userId"/>
                    <EditableExamValue
                      v-if="adding"
                      :units="units"
                      :category="category"
                      :macro_category="macro_category"
                      :parent="group.values[0]"
                      v-on:update="handleNewItem"
                      :user-id="userId"/>
                  </tbody>
                  <tfoot>
                    <tr v-if="!adding">
                      <td colspan="4" class="text-center">
                        <v-btn color="primary" @click="adding=true" fab x-small dark elevation="0">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tfoot>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
    <v-progress-linear v-else-if="!timelineItems" indeterminate />
  </v-card>
</template>

<script>
import db from '@/services/database';
import { keyBy } from '@/services/util';
import moment from 'moment';
import AddExamDialog from '@/components/exams/lab/AddExamDialog.vue';
import EditableExamValue from '@/components/exams/lab/EditableExamValue.vue';

export default {
  name: 'LabExamCard',
  components: { EditableExamValue, AddExamDialog },
  props: {
    category: null,
    macro_category: null,
    userId: null,
  },
  created() {
    this.fetchExams();
    this.fetchUnits();
  },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchUnits() {
      const records = await db.choices.filter((i) => i.category === 'MISURA').toArray();
      this.units = records.map((choice) => choice.value);
    },
    async handleNewItem() {
      await this.fetchExams();
      this.adding = false;
    },
    async fetchExams() {
      const userExams = await db.exams.where({ id_person: this.userId }).toArray();
      const examIds = [...new Set(userExams.map((item) => item.id_exam).filter((id) => !!id))];
      const examDefinitions = await db.exam_register.bulkGet(examIds);
      const keyedExamDefinitions = keyBy(examDefinitions, 'id');
      const examsGroups = {};
      userExams.forEach((item) => {
        const examDef = keyedExamDefinitions[item.id_exam];
        if (!examDef
          || (examDef.category !== this.category && this.macro_category !== 'LABORATORIO ALTRO')
          || examDef.macro_category !== this.macro_category) {
          return;
        }
        const modItem = {
          ...item,
          exam: keyedExamDefinitions[item.id_exam],
          highlight: item.highlight === 1 || item.highlight === '1' || item.highlight === true,
        };
        if (!examsGroups[modItem.from]) {
          examsGroups[modItem.from] = [];
        }
        examsGroups[modItem.from].push(modItem);
      });
      const res = [];
      Object.keys(examsGroups)
        .forEach((k) => {
          examsGroups[k]
            .sort((a, b) => new Date(a.creation).getTime() - new Date(b.creation).getTime());
          res.push({ date: k, values: examsGroups[k] });
        });
      res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.timelineItems = res;
    },
  },
  data() {
    return {
      adding: false,
      timelineItems: null,
      database: db,
      units: [],
    };
  },
};
</script>

<style scoped>

</style>
