<template>
  <v-container fluid class="pa-0" v-if="tabs">
    <v-toolbar>
      <v-tabs v-model="tab" centered icons-and-text
        grow md12 outlined hide-slider
        active-class="active-lab-exam-tab">
        <v-tab :append="true" v-for="tab in tabs" :key="tab.key" :href="`#t-${tab.key}`">
          {{tab.name}}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="tab"  class="mt-10" >
      <v-tab-item v-for="tab in tabs" :key="tab.key"  :value="`t-${tab.key}`" class="mt-10" >
        <LabExamCard :user-id="user.id" :category="tab.category"
                     :macro_category="tab.macro_category"/>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import LabExamCard from '@/components/exams/lab/LabExamCard.vue';
import api from '@/services/api';

const labExamsTabs = [
  {
    name: 'Sangue',
    key: 'blood',
    category: 'SANGUE',
    macro_category: 'LABORATORIO',
  },
  {
    name: 'Urine',
    key: 'urine',
    category: 'URINE',
    macro_category: 'LABORATORIO',
  },
  {
    name: 'Feci',
    key: 'fecis',
    category: 'FECI',
    macro_category: 'LABORATORIO',
  },
  {
    name: 'Liquido Seminale',
    key: 'seminal',
    category: 'LIQUIDO SEMINALE',
    macro_category: 'LABORATORIO ALTRO',
    rules: [(userProfile) => userProfile.sex === 'M'],
  },
  {
    name: 'Altro',
    key: 'lab_other',
    macro_category: 'LABORATORIO ALTRO',
  },
];

export default {
  name: 'LabExam',
  components: { LabExamCard },
  methods: {
    async filterTabs() {
      const userProfile = await api.fetchPatientProfile(this.user.id);
      this.tabs = labExamsTabs.filter((tab) => !tab.rules || tab.rules
        .map((r) => r(userProfile))
        .reduce((acc, value) => acc && value));
      this.tab = `t-${this.tabs[0].key}`;
    },
  },
  created() {
    this.filterTabs();
  },
  data() {
    return {
      tabs: null,
      tab: null,
      user: this.$store.state.user,
    };
  },
};
</script>

<style scoped>
.active-lab-exam-tab {
  background-color: #BBDEFB;
}
</style>
