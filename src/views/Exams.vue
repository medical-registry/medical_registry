<template>
  <v-container fluid v-if="tabs" class="pa-0">
      <v-toolbar color="blue lighten-5" flat elevation="2">
        <template v-slot:default>
          <v-tabs v-model="tab" centered slider-color="blue" grow>
            <v-tab v-for="(tab, key, i) in tabs" :key="i" :href="`#tab-${i}`">
              {{tab.macro_category}}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(tab, key, i) in tabs" :key="i" :value="`tab-${i}`">
          <NonLabExams :section="tab" />
        </v-tab-item>
      </v-tabs-items>
  </v-container>
</template>

<script>
import db from '@/services/database';
import NonLabExams from '@/components/exams/non-lab/NonLabExams.vue';

export default {
  name: 'LabExam',
  // eslint-disable-next-line vue/no-unused-components
  components: { NonLabExams },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const exams = await db.exam_register.where('macro_category')
        .noneOf(['LABORATORIO', 'LABORATORIO ALTRO'])
        .toArray();
      this.tabs = exams
        .map((ex) => ({
          macro_category: ex.macro_category,
          category: ex.category,
          key: ex.macro_category.toLowerCase().replace(' ', '_'),
        }))
        .reduce((acc, item) => {
          if (acc && !acc[item.key]) {
            acc[item.key] = { macro_category: item.macro_category, categories: [item.category] };
          } else if (acc[item.key].categories.indexOf(item.category) < 0) {
            acc[item.key].categories.push(item.category);
          }
          return acc;
        }, {});
    },
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
  }
</style>
