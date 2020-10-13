<template>
  <v-text-field
    v-model="record.name"
    label="Nome Esame"
    :rules="[v => !!v && v.length > 0 || 'Inserisci Nome Esame']"
    @change="$emit('change', record)"/>
</template>

<script>
const defaultRecord = { name: null, sex: 'A' };
export default {
  name: 'CustomExamForm',
  methods: {
    reset() {
      this.record = { ...defaultRecord };
    },
  },
  data() {
    return {
      valid: false,
      record: {
        ...defaultRecord,
      },
    };
  },
};
</script>
