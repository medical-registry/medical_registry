<template>
  <v-container>
    <v-card elevation="0">
      <v-container :class="timelineItems && timelineItems.length > 0 ? 'text-right': 'text-center'">
        <AddNonLabExamDialog
          :macro_category="macro_category"
          :category="category"
          :units="[]"
          :user_id="userId"
          v-on:created="fetchExams"
          :addButtonAlign="timelineItems && timelineItems.length> 0 ?
          'text-right' : 'text-center'"/>
      </v-container>
      <v-container v-if="timelineItems && Object.keys(timelineItems).length>0">
        <v-timeline  align-top dense>
          <NonLabExamItem v-for="group in timelineItems" :key="group.id_care"
            :group="group"
            v-on:delete="fetchExams"
            v-on:change="fetchExams"
            :category="category"
            :macro_category="macro_category"
            :units="[]"
            :user-id="userId"/>
        </v-timeline>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api';
import NonLabExamItem from '@/components/exams/non-lab/NonLabExamItem.vue';
import AddNonLabExamDialog from '@/components/exams/non-lab/AddNonLabExamDialog.vue';

export default {
  name: 'NonLabExamCategoryTab',
  components: { AddNonLabExamDialog, NonLabExamItem },
  props: {
    category: null,
    macro_category: null,
  },
  created() {
    this.fetchExams();
  },
  methods: {
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
      timelineItems: null,
      userId: this.$store.state.user.id,
    };
  },
};
</script>

<style scoped>

</style>
