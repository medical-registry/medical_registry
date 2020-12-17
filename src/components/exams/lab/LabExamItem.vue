<template>
  <v-timeline-item small>
    <v-card class="elevation-3 px-4" v-if="group">
      <v-card-title class="headline capitalized">
        <v-row>
          <v-col v-if="!group.to" md9>
            {{formatDate(group.from)}}<span v-if="group.time">, ore {{group.time}}</span>
          </v-col>
          <v-col v-else md9>
            Dal {{formatDate(group.from)}} al {{formatDate(group.to)}}
          </v-col>
          <v-col class="text-right" md3>
            <AddExamDialog
              :editing="true"
              v-if="units"
              :macro_category="macro_category"
              :category="category"
              :units="units"
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
        <p v-if="group.diagnostic_question">
          <strong>Quesito:</strong>
          <span class="capitalized">
            {{group.diagnostic_question.toLowerCase()}}
          </span>
        </p>
        <p v-if="group.requisites">
          <strong>Requisiti:</strong>
          <span>{{group.requisites}}</span>
          <br/>
        </p>
        <p v-if="group.note">
          <strong>Note</strong>
          <br/>
          <span>{{group.note}}</span>
        </p>
        <v-simple-table class="mt-5">
          <template v-slot:default>
            <thead>
              <tr class="px-3">
                <th class="text-left">Parametro</th>
                <th class="text-left">Valore</th>
                <th class="text-left">Unità</th>
                <th colspan="2"/>
              </tr>
            </thead>
            <tbody>
              <EditableExamValue
                v-for="item in group.values" :key="item.id"
                :units="units"
                :item="item"
                :parent="group"
                v-on:delete="handleChange"
                v-on:update="handleChange"/>
              <EditableExamValue
                :key="`add-to-${group.id_care}`"
                v-if="adding"
                :units="units"
                :parent="group"
                v-on:update="handleNewItem"
                v-on:cancel="adding = false"
              />
            </tbody>
            <tfoot>
              <tr v-if="!adding">
                <td colspan="4" class="text-center">
                  <v-btn color="primary"
                    @click="adding=true" fab x-small dark elevation="0"
                    :class="group.values && group.values.length>0? 'my-0': 'my-5'">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-card-text>
      <p v-if="group.diagnostic_question">
        <strong>Documenti:</strong>
        <RelatedFiles :id-care="group.id_care" related-table="exams"/>
      </p>
    </v-card>
  </v-timeline-item>
</template>
<script>
import AddExamDialog from '@/components/exams/lab/AddExamDialog.vue';
import EditableExamValue from '@/components/exams/lab/EditableExamValue.vue';
import db from '@/services/database';
import moment from 'moment';
import RelatedFiles from '@/components/file_manager/RelatedFiles.vue';

export default {
  name: 'LabExamItem',
  components: {
    RelatedFiles,
    AddExamDialog,
    EditableExamValue,
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
