<template>
  <v-card elevation="0" class="mt-10">
    <v-container :class="timelineItems && timelineItems.length > 0 ? 'text-right': 'text-center'">
      <AddExamDialog
        v-if="units"
        :macro_category="macro_category"
        :category="category"
        :units="units"
        :user_id="userId"
        v-on:created="fetchExams"
        :addButtonAlign="timelineItems && timelineItems.length> 0 ? 'text-right' : 'text-center'"/>
    </v-container>
    <v-container v-if="timelineItems && Object.keys(timelineItems).length>0">
      <v-timeline  align-top dense v-if="noValueExamView">
        <LabExamItem  v-for="group in timelineItems" :key="group.id_care"
                      :group="group"
                      v-on:delete="fetchExams"
                      v-on:change="fetchExams"
                      :category="category"
                      :macro_category="macro_category"
                      :units="units"
                      :user-id="userId"/>
      </v-timeline>
      <v-timeline  align-top dense v-else>
        <LabOtherExamItem v-for="group in timelineItems" :key="group.id_care"
                      :group="group"
                      v-on:delete="fetchExams"
                      v-on:change="fetchExams"
                      :category="category"
                      :macro_category="macro_category"
                      :units="units"
                      :user-id="userId"/>
      </v-timeline>
    </v-container>
    <v-progress-linear v-else-if="!timelineItems" indeterminate />
  </v-card>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import api from '@/services/api';
import AddExamDialog from '@/components/exams/lab/AddExamDialog.vue';
import LabExamItem from '@/components/exams/lab/LabExamItem.vue';
import LabOtherExamItem from '@/components/exams/lab/LabOtherExamItem.vue';

export default {
  name: 'LabExamCard',
  components: { LabExamItem, AddExamDialog, LabOtherExamItem },
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
    async fetchExams() {
      const userExams = await api.fetchUserExams(this.userId, this.noValueExamView);
      this.timelineItems = userExams
        .filter((item) => (!this.category || this.category === item.category)
          && item.macro_category === this.macro_category)
        .sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime());
    },
  },
  data() {
    return {
      adding: false,
      timelineItems: null,
      database: db,
      noValueExamView: this.macro_category !== 'LABORATORIO ALTRO',
      units: [],
    };
  },
};
</script>
