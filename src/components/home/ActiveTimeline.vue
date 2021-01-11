<template>
  <v-card elevation="0" >
    <v-card-title>
      {{title}}
    </v-card-title>
    <v-timeline dense align-top v-if="events && events.length > 0">
      <v-timeline-item v-for="item in events" :key="item.id" color="warning" small>
        <v-layout>
          <v-flex>
            <span class="text-h7 text-capitalize">{{formatDate(item.from)}}</span>
            <br>
            <div v-if="type === 'diagnosis'">
              <strong>
                {{item.disease.name}}
                <span v-if="item.chronic">(Cronico)</span>
              </strong>
              <div class="caption text-capitalize" v-if="item.body_impacted">
                {{item.body_impacted}}
              </div>
            </div>
            <div v-else-if="type === 'prescriptions'">
              <strong class="text-capitalize">
                {{item.medicine.name.toLowerCase()}}
                ({{item.medicine.active_principle.toLowerCase()}})
              </strong>
              <div class="caption text-capitalize" v-if="item.daily_frequency">
                {{item.daily_frequency.toLowerCase()}}
              </div>
              <div class="caption text-capitalize reason" v-if="item.disease" title="Diagnosi">
                <v-icon small>mdi-clipboard-plus-outline</v-icon>
                <strong>{{item.disease.def.name.toLowerCase()}}</strong>
              </div>
              <div class="caption text-capitalize reason" v-else-if="item.allergy" title="Allergia">
                <v-icon small>mdi-asterisk</v-icon>
                <strong>{{item.allergy.def.name.toLowerCase()}}</strong>
              </div>
              <div class="caption text-capitalize reason" v-else-if="item.trauma" title="Trauma">
                <v-icon small>mdi-bandage</v-icon>
                <strong>{{item.trauma.name.toLowerCase()}}</strong>
              </div>
              <div class="caption text-capitalize reason"
                   v-else-if="item.intervention" title="Intervento">
                <v-icon small>mdi-hospital-building</v-icon>
                <strong>{{item.intervention.def.name.toLowerCase()}}</strong>
              </div>
            </div>
            <div v-if="type === 'exams'">
              <div class="text-capitalize font-weight-bold">
                <span v-if="item.macro_category==='LABORATORIO ALTRO'">
                  {{item.def.name.toLowerCase()}}
                </span>
                <span v-else>{{item.category.toLowerCase()}}</span>
              </div>
              <div>
                <span v-if="/LABORATORIO.*/gi.test(item.macro_category)">
                  Esame Di Laboratorio
                </span>
                <span v-else>
                  Visita / Esame Non Di Laboratorio
                </span>
              </div>
              <div class="caption text-capitalize reason" title="Quesito Diagnostico">
                <v-icon small>mdi-help-circle-outline</v-icon>
                <strong>{{item.diagnostic_question}}</strong>
              </div>
            </div>
            <div class="caption text-capitalize mt-1" v-if="item.note && type !== 'exams'">
              <strong>Note</strong><br>{{item.note}}
            </div>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-card-title v-else>
      <v-card-title>
        Nessuna
      </v-card-title>
    </v-card-title>
    <v-card-actions>
      <AddDiseaseDialog v-if="type === 'diagnosis'" :on-add="fetchData"/>
      <AddPrescriptionDialog v-if="type === 'prescriptions'" :on-add="fetchData"/>
      <AddExamDialog v-if="type === 'exams'" :on-add="fetchData" :rounded="true" :editing="false"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment';
import api from '@/services/api';
import AddDiseaseDialog from '@/components/home/AddDiseaseDialog.vue';
import AddPrescriptionDialog from '@/components/home/AddPrescriptionDialog.vue';
import AddExamDialog from '@/components/exams/lab/AddExamDialog.vue';

const compareEvents = (order) => (o1, o2) => {
  const d1 = order === 'asc' ? new Date(o1.from) : new Date(o2.from);
  const d2 = order === 'asc' ? new Date(o2.from) : new Date(o1.from);
  return d1.getTime() - d2.getTime();
};

export default {
  name: 'ActiveTimeline',
  components: { AddExamDialog, AddPrescriptionDialog, AddDiseaseDialog },
  props: {
    userId: null,
    type: null,
    title: null,
  },
  data() {
    return {
      events: [],
    };
  },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchData() {
      let response;
      let filterItems = (item) => !item.to;
      if (this.type === 'diagnosis') {
        response = (await api.fetchPatientDiagnosis(this.userId)).data;
      } else if (this.type === 'prescriptions') {
        response = (await api.fetchUserPrescriptions(this.userId)).data;
      } else if (this.type === 'exams') {
        response = await api.fetchAllExams(this.userId);
        filterItems = (item) => new Date(item.from).getTime() > new Date().getTime();
      }
      this.events = response
        .filter(filterItems)
        .sort(compareEvents('desc'));
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
  .reason {
    cursor: pointer;
    strong {
      line-height: 16px;
      margin-left: 5px;
    }
  }
</style>
