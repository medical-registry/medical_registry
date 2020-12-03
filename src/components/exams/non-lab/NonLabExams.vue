<template>
  <v-container v-if="section" class="pa-0 pt-0 pb-10" fluid>
    <v-tabs vertical color="primary" class="pa-0 pl-10" v-model="tab" >
      <v-container  class="py-12 pl-0 vertical-category-wrapper">
        <v-tab v-for="(category, i) in section.categories" :key="i"
               class="non-lab-category-tab"
               :href="`#tab-${section.key}-${i}`">
          {{category}}
        </v-tab>
      </v-container>
      <v-tab-item v-for="(category, i) in section.categories" :key="i"
                   :value="`tab-${section.key}-${i}`">
        <v-card flat class="pt-0" grow >
          <v-card-text class="pt-0">
            <NonLabExamCategoryTab :category="category" :macro_category="section.macro_category"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import NonLabExamCategoryTab from '@/components/exams/non-lab/NonLabExamCategoryTab.vue';

export default {
  name: 'NonLabExams',
  components: { NonLabExamCategoryTab },
  props: {
    section: null,
  },
  data() {
    return {
      tab: `tab-${this.section.key}-0`,
    };
  },
};
</script>

<style scoped>
.active-lab-exam-tab {
  background-color: #BBDEFB;
}
.non-lab-category-tab {
  justify-content: start;
}
.vertical-category-wrapper {
  border-right: 1px solid lightgrey;
  min-height: 350px;
  min-width: 250px;
}
</style>
