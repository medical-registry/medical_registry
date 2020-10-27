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
import db from '@/services/database';
import LineChart from '@/components/exams/lab/LineChart';

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
      const filter = { id_person: this.personId, id_exam: this.examId };
      const res = await db.exams.where(filter).toArray();
      this.dataPoints = {
        labels: res.map((entry) => entry.from),
        datasets: [
          {
            label: this.examName,
            data: res.map((entry) => entry.value),
          },
        ],
      };
      // this.dataPoints = res.map((entry) => ({ x: entry.from, y: entry.value }));
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
