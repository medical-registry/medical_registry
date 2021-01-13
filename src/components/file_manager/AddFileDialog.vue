<template>
  <v-dialog width="600" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="!baseModel"
             color="primary" rounded outlined icon elevation="0" v-bind="attrs" v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else small color="success" v-bind="attrs" v-on="on">Modifica</v-btn>
    </template>
    <v-card>
      <v-card-title v-if="baseModel">Aggiungi Documento</v-card-title>
      <v-card-title v-else>Aggiungi Documento</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-file-input v-if="!baseModel"
                        v-model="file" truncate-length="20" show-size placeholder="Seleziona file"
                        @change="fileChange($event)"
                        :rules="[v => !!v || 'Seleziona File']"/>
          <div v-if="file || baseModel">
            <v-select :items="categories"
                      required
                      label="Tipo Documento *"
                      v-model="fileModel.category"
                      :rules="[v => !!v || 'Seleziona Tipo Documento']"
                      prepend-icon="mdi-magnify"
                      @change="categoryChange"/>
            <v-text-field label="Titolo Documento *"
                          prepend-icon="mdi-format-title"
                          v-model="fileModel.title" required
                          :rules="[v => !!v || 'Inserisci il titolo del documento']"/>
            <v-menu
              v-model="dateDialog"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateText"
                  label="Data Rilascio *"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="[v => !!v || 'Aggiungi Data Diagnosi']"/>
              </template>
              <v-date-picker v-model="fileModel.date" @input="dateDialog = false" locale="it"/>
            </v-menu>
            <v-textarea class="pt-5"
              outlined
              placeholder="Descrizione"
              label="Descrizione"
              v-model="fileModel.description"/>
          </div>
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

const defaultModel = {
  title: null,
  category: null,
  type: null,
  date: null,
  description: null,
};
const categories = ['RICETTA MEDICA', 'REFERTO', 'RICEVUTA/SCONTRINO', 'CERTIFICATO', 'ALTRO'];

export default {
  name: 'AddFileDialog',
  props: {
    userId: null,
    idCare: null,
    relatedTable: null,
    baseModel: null,
  },
  components: { },
  computed: {
    dateText() {
      if (!this.fileModel.date) {
        return null;
      }
      return moment(this.fileModel.date).format('LL');
    },
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
    categoryChange(e) {
      this.fileModel.title = e;
    },
    buildBaseModel() {
      if (this.baseModel) {
        return { ...this.baseModel };
      }
      return {
        ...defaultModel,
        id_person: this.userId,
        id_care: this.idCare,
        related_table: this.relatedTable,
      };
    },
    async save() {
      this.fileModel.update = moment().format();
      if (!this.baseModel) {
        this.fileModel.creation = moment().format();
      }
      const id = await db.file_group.put(this.fileModel);
      if (!this.baseModel) {
        const file = {
          id_group: id,
          group_order: 0,
          path: this.fileB64,
          name: this.file.name,
          'content-type': this.file.type,
          creation: moment().format(),
          update: moment().format(),
        };
        db.filepath.put(file);
        this.$emit('created');
      } else {
        this.$emit('updated');
      }
      this.reset();
      this.dialog = false;
    },
    reset() {
      this.fileModel = this.buildBaseModel();
      this.fileB64 = null;
      this.dateDialog = false;
      this.file = null;
    },
  },
  data() {
    return {
      dialog: false,
      fileModel: this.buildBaseModel(),
      categories,
      fileB64: null,
      fileType: null,
      dateDialog: false,
      file: null,
      valid: this.baseModel !== null,
    };
  },
};
</script>

<style scoped>

</style>
