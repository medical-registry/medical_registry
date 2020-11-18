<template>
  <v-card elevation="0" >
    <v-card-title>
      {{title}}
    </v-card-title>
    <v-timeline dense
                align-top
                v-if="events && events.length > 0">
      <v-timeline-item
        v-for="item in events"
        :key="item.id"
        color="warning"
        small
      >
        <v-layout>
          <v-flex v-if="type === 'diagnosis'">
            <span class="text-h7">{{formatDate(item.from)}}</span>
            <br>
            <strong>
              {{item.disease.name}}
              <span v-if="item.chronic">(Cronico)</span>
            </strong>
            <div class="caption" v-if="item.body_impacted">{{item.body_impacted}}</div>
            <div class="caption" v-if="item.note">{{item.note}}</div>
          </v-flex>
          <v-flex v-else-if="type === 'prescriptions'">
            <span class="text-h7">{{formatDate(item.from)}}</span>
            <br>
            <strong class="text-capitalize">
              {{item.medicine.name.toLowerCase()}}
              ({{item.medicine.active_principle.toLowerCase()}})
            </strong>
            <div class="caption text-capitalize">{{item.daily_frequency.toLowerCase()}}</div>
            <div class="caption text-capitalize" v-if="item.disease">
              Per il trattamento di: <strong>{{item.disease.def.name.toLowerCase()}}</strong>
            </div>
            <div class="caption text-capitalize" v-else-if="item.allergy">
              Per allergia: <strong>{{item.allergy.def.name.toLowerCase()}}</strong>
            </div>
            <div class="caption text-capitalize" v-else-if="item.trauma">
              A seguito di: (Trauma) <strong>{{item.trauma.name.toLowerCase()}}</strong>
            </div>
            <div class="caption text-capitalize" v-else-if="item.intervention">
              A seguito di: (Intervento)
              <strong>{{item.intervention.def.name.toLowerCase()}}</strong>
            </div>
          </v-flex>
          <v-flex v-else-if="type === 'exams'">
            <span class="text-h7">{{formatDate(item.from)}}</span>
            <br>
            <strong>
              {{item.allergy.name}} ({{item.allergy.category}})
            </strong>
            <br>
            <div class="caption" v-if="item.note">
              Intensità: {{item.severity}}
            </div>
            <div class="caption" v-if="item.note">{{item.note}}</div>
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
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment';
import api from '@/services/api';
import AddDiseaseDialog from '@/components/home/AddDiseaseDialog.vue';
import AddPrescriptionDialog from '@/components/home/AddPrescriptionDialog.vue';

const compareEvents = (order) => (o1, o2) => {
  const d1 = order === 'asc' ? new Date(o1.from) : new Date(o2.from);
  const d2 = order === 'asc' ? new Date(o2.from) : new Date(o1.from);
  return d1.getTime() - d2.getTime();
};

export default {
  name: 'ActiveTimeline',
  components: { AddPrescriptionDialog, AddDiseaseDialog },
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
    formatDate: (value) => moment(value).format('DD MMM, YY'),
    async fetchData() {
      let response;
      if (this.type === 'diagnosis') {
        response = await api.fetchPatientDiagnosis(this.userId);
      } else if (this.type === 'prescriptions') {
        response = await api.fetchUserPrescriptions(this.userId);
      } else if (this.type === 'exams') {
        response = await api.fetchUserAllergies(this.userId);
      }
      this.events = response.data
        .filter((item) => !item.to)
        .sort(compareEvents('desc'));
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
