<template>
  <v-container fluid class="pa-0" v-if="tabs">
    <v-toolbar>
      <v-tabs
        v-model="tab"
        centered
        icons-and-text
        grow
        md12
        outlined
        hide-slider
        active-class="active-lab-exam-tab"
      >
        <v-tab
          :append="true"

          v-for="tab in tabs"
          :key="tab.key"
          :href="`#t-${tab.key}`">
          {{tab.name}}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="tab in tabs" :key="tab.key"  :value="`t-${tab.key}`"
      >
        <LabExamCard
          :user-id="user.id"
          :category="tab.category"
          :macro_category="tab.macro_category"/>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import db from '@/services/database';
import LabExamCard from '@/components/exams/lab/LabExamCard.vue';

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
    category: 'SANGUE',
    macro_category: 'LABORATORIO',
  },
  {
    name: 'Feci',
    key: 'fecis',
    category: 'SANGUE',
    macro_category: 'LABORATORIO',
  },
  {
    name: 'Test',
    key: 'tests',
    category: 'SANGUE',
    macro_category: 'LABORATORIO ALTRO',
  },
];

export default {
  name: 'LabExam',
  components: { LabExamCard },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const res = await db.exam_register
        .orderBy('category')
        .filter((item) => item.macro_category === 'LABORATORIO')
        .uniqueKeys();
      this.tabs = res.map((category) => ({
        category,
        macro_category: 'LABORATORIO',
        name: category,
        key: category.toLowerCase().replace(' ', '_'),
      }));
    },
  },
  data() {
    return {
      tabs: null,
      tab: `t-${labExamsTabs[0].key}`,
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
