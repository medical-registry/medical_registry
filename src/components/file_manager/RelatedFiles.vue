<template>
  <v-container v-if="files">
    <FileViewer v-for="group in files" :key="group.id" :group="group"
                v-on:change="fetchRelatedFiles" v-on:delete="fetchRelatedFiles"/>
    <AddFileDialog v-on:created="fetchRelatedFiles"
                   :user-id="userId" :id-care="idCare" :related-table="relatedTable"/>
  </v-container>
</template>

<script>
import db from '@/services/database';
import { keyBy } from '@/services/util';
import FileViewer from '@/components/file_manager/FileViewer.vue';
import AddFileDialog from '@/components/file_manager/AddFileDialog.vue';

export default {
  name: 'RelatedFiles',
  components: { AddFileDialog, FileViewer },
  props: {
    idCare: null,
    relatedTable: null,
  },
  created() {
    this.fetchRelatedFiles();
  },
  methods: {
    async fetchRelatedFiles() {
      const fileGroups = await db.file_group
        .where({
          id_care: this.idCare,
          related_table: this.relatedTable,
        })
        .toArray();
      const files = await db.filepath.where('id_group')
        .anyOf(fileGroups.map((file) => file.id))
        .toArray();
      const keyedFiles = keyBy(files, 'id_group', true);
      Object.values(keyedFiles)
        .forEach((list) => list.sort((a, b) => a.group_order - b.group_order));
      this.files = fileGroups.map((group) => ({
        ...group,
        files: keyedFiles[group.id],
      }));
    },
  },
  data() {
    return {
      files: null,
      userId: this.$store.state.user.id,
    };
  },
};
</script>

<style scoped>
</style>
