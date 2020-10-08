<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    hide-no-data
    hide-selected
    :item-text="searchField"
    item-value="API"
    :label="label"
    prepend-icon="mdi-magnify"
    return-object
    :rules="[v => !!v && required  || this.invalidHint]"
    @change="$emit('change', model)"
  />
</template>

<script>
export default {
  name: 'AutocompleteSearch',
  props: {
    table: null,
    label: null,
    initialValue: null,
    searchField: {
      type: String,
      default: 'name',
    },
    invalidHint: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    filters: null,
  },
  data() {
    return {
      valid: this.initialValue !== undefined,
      dialog: false,
      entries: this.initialValue ? [this.initialValue] : [],
      isLoading: false,
      search: this.initialValue ? this.initialValue[this.searchField] : null,
      model: this.initialValue ? { ...this.initialValue } : null,
    };
  },
  computed: {
    fields() {
      if (!this.model) return [];
      return Object.keys(this.model).map((key) => ({
        key,
        value: this.model[key] || 'n/a',
      }));
    },
    items() {
      return this.entries;
    },
  },
  watch: {
    async search(val, oldValue) {
      if (val === oldValue || this.isLoading) return;
      if (val && val.length <= 2) {
        this.entries = [];
        this.count = 0;
        return;
      }
      const regexp = new RegExp(`${val}.*`, 'gi');
      const field = this.searchField;
      this.isLoading = true;
      const query = this.table.filter((item) => regexp.test(item[field]));
      if (this.filters) {
        this.filters.forEach((filterFunction) => query.filter((item) => filterFunction(item)));
      }
      const res = await query.toArray();
      this.count = res.length;
      this.entries = res;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>

</style>
