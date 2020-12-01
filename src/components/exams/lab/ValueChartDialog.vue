<template>
  <v-dialog v-model="dialog" max-width="600px" >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="teal"
             fab x-small dark
             elevation="0" class="mr-2"
             v-bind="attrs" v-on="on"
             v-on:click="loadData" >
        <v-icon>mdi-chart-line</v-icon>
      </v-btn>
    </template>
    <v-card>
        <div class="small pa-10" >
          <line-chart :chart-data="dataPoints" v-if="dataPoints"/>
        </div>
    </v-card>
  </v-dialog>
</template>

<script>
import LineChart from '@/components/exams/lab/LineChart';
import api from '@/services/api';

export default {
  name: 'ValueChartDialog',
  components: { LineChart },
  props: {
    examId: null,
    personId: null,
    examName: null,
  },
  methods: {
    async loadData() {
      const exams = await api.fetchUserExams(this.userId, true);
      const res = exams
        .flatMap((group) => {
          if (group.values) {
            return group.values
              .filter((item) => item.id_exam_type === this.examId)
              .map((item) => ({
                from: group.from,
                value: item.value,
                highlight: item.highlight,
              }));
          }
          return null;
        })
        .filter((item) => !!item)
        .sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
      this.dataPoints = {
        labels: res.map((entry) => entry.from),
        datasets: [
          {
            label: this.examName,
            data: res.map((entry) => entry.value),
          },
        ],
      };
    },
  },
  data() {
    return {
      dialog: false,
      dataPoints: null,
    };
  },
};
</script>
<style scoped>
  .small {
    max-width: 600px;
  }
</style>
