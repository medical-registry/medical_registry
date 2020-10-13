<template>
  <v-card>
    <v-card-title class="headline">
      Aggiungi {{tableData[tableName].displayName}}
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" lazy-validation>
        <CustomExamForm ref= "activeForm"
                        v-if="tableName === 'exam_register'"
                        v-on:change="updateModel"/>
        <CustomExamForm ref= "activeForm"
                        v-else-if="tableName === 'exam'"
                        v-on:change="updateModel"/>
      </v-form>
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="error" text @click="$emit('cancel')">
        Chiudi
      </v-btn>
      <v-spacer/>
      <v-btn :disabled="!valid" color="primary" text @click="save()">
        Salva
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CustomExamForm from '@/components/custom_value_forms/CustomExamForm.vue';

const tableData = {
  allergy_register: { displayName: 'Allergia' },
  disease_register: { displayName: 'Diagnosi' },
  doctor_register: { displayName: 'Dottore' },
  exam_register: { displayName: 'Esame' },
  medicine_register: { displayName: 'Farmaco' },
  location_register: { displayName: 'Luogo' },
  intervention_register: { displayName: 'Intervento' },
  exemption_register: { displayName: 'Esenzione' },
  screening_register: { displayName: 'Screening' },
  therapy_register: { displayName: 'Terapia' },
};

export default {
  name: 'AddCustomValue',
  components: { CustomExamForm },
  props: {
    table: null,
    searchText: null,
    defaults: null,
  },
  methods: {
    updateModel(object) {
      this.model = { ...this.defaults, ...object, id_user: this.$store.state.user.id };
    },
    async save() {
      if (!this.model) {
        return;
      }
      const recordId = await this.table.put(this.model);
      const record = await this.table.get(recordId);
      this.model = null;
      this.valid = false;
      this.$refs.activeForm.reset();
      this.$emit('created', record);
    },
  },
  data() {
    return {
      userId: this.$store.state.user.id,
      tableName: this.table.name,
      model: null,
      tableData,
      valid: false,
    };
  },
};
</script>

<style scoped>

</style>
