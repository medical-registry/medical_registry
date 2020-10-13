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
  props: {
    passedText: null,
  },
  methods: {
    reset() {
      this.record = { ...defaultRecord };
    },
  },
  mounted() {
    if (this.passedText && this.passedText.trim().length > 0) {
      this.record.name = this.passedText;
      this.$emit('change', this.record);
    }
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
