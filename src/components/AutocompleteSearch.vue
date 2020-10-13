<template>
  <div>
    <v-combobox
      v-model="model"
      :hide-no-data="!search"
      :items="entries"
      :search-input.sync="search"
      :item-text="searchField"
      :label="label"
      prepend-icon="mdi-magnify"
      return-object
      :rules="[v => !!v && required  || this.invalidHint]"
      @change="$emit('change', model)">
      <template v-slot:no-data>
        <v-list-item @click.stop="dialog = true">
          <span class="subheading">Aggiungi <b>'{{search}}'</b></span>
        </v-list-item>
      </template>
    </v-combobox>
    <v-dialog v-model="dialog" max-width="600px">
      <AddCustomValue
        :table="table"
        :search-text="search"
        :defaults="defaultCreationValues"
        v-on:created="handleRecordCreation"
        v-on:cancel="dialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import AddCustomValue from '@/components/AddCustomValue.vue';

export default {
  name: 'AutocompleteSearch',
  components: { AddCustomValue },
  props: {
    table: null,
    label: null,
    initialValue: null,
    defaultCreationValues: {
      type: Object,
      default: () => ({}),
    },
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
  methods: {
    handleRecordCreation(record) {
      this.entries = [record];
      this.model = { ...record };
      this.search = record[this.searchField];
      this.dialog = false;
      this.$emit('change', record);
    },
  },
  watch: {
    async search(val) {
      if (this.isLoading) return;
      const regexp = new RegExp(`${val}.*`, 'gi');
      const field = this.searchField;
      this.isLoading = true;
      const query = this.table.filter((item) => regexp.test(item[field])
              && (!item.id_user || this.$store.state.user.id === item.id_user));
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
