<template>
  <v-dialog width="600" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="transparent" elevation="0" x-large block tile height="100%"
             v-bind="attrs" v-on="on"
             title="Aggiungi immagine" class="pa-0">
        <v-icon color="primary" x-large >mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Aggiungi File</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-file-input v-model="file" truncate-length="20" show-size placeholder="Seleziona file"
                        @change="fileChange($event)"
                        :rules="[v => !!v || 'Seleziona File']"/>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-btn color="error" @click="cancel">Annulla</v-btn>
        <v-spacer/>
        <v-btn color="primary" @click="save" :disabled="!valid">Salva</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';

export default {
  name: 'AddSingleFileDialog',
  props: {
    groupId: null,
    groupOder: null,
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.reset();
    },
    fileChange(file) {
      const reader = new FileReader();
      this.file = file;
      reader.addEventListener('load', () => {
        this.fileB64 = reader.result;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
        // eslint-disable-next-line prefer-destructuring
        this.fileModel.type = file.type.split('/')[0];
      }
    },
    async save() {
      const file = {
        id_group: this.groupId,
        group_order: this.groupOder,
        path: this.fileB64,
        name: this.file.name,
        'content-type': this.file.type,
        creation: moment().format(),
        update: moment().format(),
      };
      db.filepath.put(file);
      this.$emit('created');
      this.reset();
      this.dialog = false;
    },
    reset() {
      this.fileB64 = null;
      this.file = null;
    },
  },
  data() {
    return {
      dialog: false,
      fileB64: null,
      file: null,
      valid: false,
    };
  },
};
</script>

<style scoped>

</style>
