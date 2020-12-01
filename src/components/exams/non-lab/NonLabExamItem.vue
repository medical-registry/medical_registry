<template>
  <v-timeline-item small>
    <v-card class="elevation-3">
      <v-card-title class="headline capitalized">
        <v-row>
          <v-col v-if="!group.to" md9>
            {{formatDate(group.from)}}<span v-if="group.time">, ore {{group.time}}</span>
          </v-col>
          <v-col v-else md9>
            Dal {{formatDate(group.from)}} al {{formatDate(group.to)}}
          </v-col>
          <v-col class="text-right" md3>
            <AddNonLabExamDialog
              :editing="true"
              :macro_category="group.macro_category"
              :category="group.category"
              :user_id="userId"
              :initial-value="group"
              :add-button-align="'text-right'"
              v-on:updated="handleChange"/>
            <v-btn color="error" fab x-small dark elevation="0" @click="deleteExam">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <span class="capitalized">
          <span class="title">{{group.def.name.toLowerCase()}}</span><br>
        </span>
        <span class="text-subtitle-1">
          <strong>Quesito:</strong>
          <span class="capitalized">
            {{group.diagnostic_question.toLowerCase()}}
          </span>
        </span>
        <p class="mt-3" v-if="group.note">
          <strong>Esito</strong>
          <br/>
          <span>{{group.note}}</span>
        </p>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>
<script>
import db from '@/services/database';
import moment from 'moment';
import AddNonLabExamDialog from '@/components/exams/non-lab/AddNonLabExamDialog.vue';

export default {
  name: 'NonLabExamItem',
  components: {
    AddNonLabExamDialog,
  },
  props: {
    group: null,
    category: {},
    macro_category: {},
    units: {},
    userId: {},
  },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async deleteExam() {
      await db.exams.where({ id_care: this.group.id_care }).delete();
      this.$emit('delete');
    },
    handleNewItem() {
      this.adding = false;
      this.$emit('change');
    },
    handleChange() {
      this.$emit('change');
    },
  },
  data() {
    return {
      adding: false,
    };
  },
};
</script>
