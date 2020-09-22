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
  },
  data: () => ({
    valid: false,
    dialog: false,
    entries: [],
    isLoading: false,
    search: null,
    model: null,
  }),

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

    search(val, oldValue) {
      if (val === oldValue || this.isLoading) return;
      if (val && val.length <= 2) {
        this.entries = [];
        this.count = 0;
        return;
      }
      const regexp = new RegExp(`.*${val}.*`, 'gi');
      const field = this.searchField;
      this.isLoading = true;
      this.table
        .filter((item) => regexp.test(item[field]))
        .toArray()
        .then((res) => {
          this.count = res.length;
          this.entries = res;
        })
        .catch((err) => {
          console.error(err);
        })
        // eslint-disable-next-line no-return-assign
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style scoped>

</style>
