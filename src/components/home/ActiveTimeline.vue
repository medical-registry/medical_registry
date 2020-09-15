<template>
  <v-card elevation="0">
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
              {{item.name}}
              <span v-if="item.chronic">(Cronico)</span>
            </strong>
            <div class="caption" v-if="item.body_impacted">{{item.body_impacted}}</div>
            <div class="caption" v-if="item.note">{{item.note}}</div>
          </v-flex>
          <v-flex v-else-if="type === 'prescriptions'">
            <span class="text-h7">{{formatDate(item.from)}}</span>
            <br>
            <strong>
              {{item.name}} ({{item.medicine.active_principle}})
            </strong>
            <div class="caption">{{item.dosage}}, {{item.daily_frequency}}</div>
            <div class="caption">
              Per il trattamento di: <strong>{{item.disease.name}}</strong>
            </div>
          </v-flex>
          <v-flex v-else-if="type === 'allergies'">
            <span class="text-h7">{{formatDate(item.from)}}</span>
            <br>
            <strong>
              {{item.allergy.name}} ({{item.allergy.category}})
            </strong>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-card-title v-else>
      <v-card-title>
        Nessuna
      </v-card-title>
    </v-card-title>
  </v-card>
</template>

<script>
import moment from 'moment';
import api from '@/services/api';

const compareEvents = (order) => (o1, o2) => {
  const d1 = order === 'asc' ? new Date(o1.from) : new Date(o2.from);
  const d2 = order === 'asc' ? new Date(o2.from) : new Date(o1.from);
  return d1.getTime() - d2.getTime();
};

export default {
  name: 'ActiveTimeline',
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
  },
  mounted() {
    let promise;
    if (this.type === 'diagnosis') {
      promise = api.fetchPatientActiveDiagnosis(this.userId);
    } else if (this.type === 'prescriptions') {
      promise = api.fetchUserPrescriptions(this.userId);
    } else if (this.type === 'allergies') {
      promise = api.fetchUserAllergies(this.userId);
    }
    promise.then((response) => {
      this.events = response.data.sort(compareEvents('desc'));
    });
  },
};
</script>
