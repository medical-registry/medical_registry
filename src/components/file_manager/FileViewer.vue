<template>
  <v-dialog v-model="dialog" width="1200px" @click:outside="closeFullScreen">
    <template v-slot:activator="{ on, attrs }">
      <v-chip v-bind="attrs" v-on="on"
              class="mr-3 text-capitalize font-weight-bold"
              style="white-space: pre-wrap;"
              outlined
              color="primary">
        {{group.title}}
      </v-chip>
    </template>
    <v-card  class="d-flex flex-row pa-5" height="700px">
      <v-col md="4" class="d-flex grow pa-0" >
        <v-card tile class="d-flex grow flex-column justify-space-between pr-3" md="3" flat
                style="border-right: 1px solid rgba(0, 0, 0, 0.12);" >
          <v-card-title class="px-0">
            {{group.title}}
          </v-card-title>
          <v-card-text class="px-0">
            <p class="subtitle-1">
              {{group.category}}
            </p>
            <p class="text-body-1">
              {{group.description}}
            </p>
            <p class="text-capitalize">
              <strong>Data Rilascio </strong>{{formatDate(group.date)}}<br>
              <strong>Data Inserimento </strong>{{formatDate(group.creation)}}
            </p>
          </v-card-text>
          <v-spacer/>
          <v-card-actions class="px-0">
            <v-btn small color="error">Elimina</v-btn>
            <v-spacer/>
            <AddFileDialog :base-model="group" v-on:update="reloadGroup"/>
            <v-btn small color="primary"  dark>Stampa</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col md="8" class="d-flex grow grey lighten-2 px-10 py-7"
             v-if="fullScreenFile" style="position: relative">
        <v-btn small fab color="blue-grey lighten-3" top left absolute
               dark class="mt-7 ml-3 back-button" elevation="0"
               @click="closeFullScreen">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card tile class="pa-0" flat style="overflow: scroll; width: 100%;">
          <v-img width="100%" :src="group.files[fullScreenPosition].path" />
        </v-card>
      </v-col>
      <v-col md="8" class="d-flex grow" v-else>
        <v-row style="overflow: scroll">
          <v-col v-for="(file, n) in group.files" :key="n" md="3">
            <div class="image-wrapper" v-on:click="openFullScreen(file, n)">
              <v-responsive aspect-ratio="0.7071">
                <v-img :src="file.path" class="grey lighten-2">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"/>
                    </v-row>
                  </template>
                </v-img>
                <v-btn color="error" x-small fab top left dark elevation="0"
                       title="Elimina" absolute class="file-fab">
                  <v-icon small>mdi-trash-can</v-icon>
                </v-btn>
                <v-btn color="primary" x-small fab top right dark elevation="0"
                       title="Modifica" absolute class="file-fab">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </v-responsive>
            </div>
            <div class="text-center mt-3">{{n+1}}</div>
          </v-col>
          <v-col  md="3">
            <div class="image-wrapper">
              <v-responsive aspect-ratio="0.7071">
                <AddSingleFileDialog
                  v-on:created="reloadFiles"
                  :group-id="group.id"
                  :group-oder="group.files.length"/>
              </v-responsive>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import db from '@/services/database';
import AddFileDialog from '@/components/file_manager/AddFileDialog.vue';
import AddSingleFileDialog from '@/components/file_manager/AddSingleFileDialog.vue';

export default {
  name: 'FileViewer',
  components: { AddSingleFileDialog, AddFileDialog },
  props: {
    group: null,
  },
  methods: {
    formatDate: (date) => moment(date).format('LL'),
    openFullScreen(file, pos) {
      this.fullScreenFile = file;
      this.fullScreenPosition = pos;
    },
    closeFullScreen() {
      this.fullScreenFile = null;
    },
    async reloadFiles() {
      this.group.files = await db.filepath
        .where({ id_group: this.group.id })
        .toArray();
    },
    async reloadGroup() {
      const group = await db.file_group
        .get({ id: this.group.id });
      this.group = {
        ...group,
        files: this.group.files,
      };
    },
  },
  data() {
    return {
      dialog: false,
      fullScreenFile: null,
      fullScreenPosition: null,
    };
  },
};
</script>

<style scoped type="scss">
.image-wrapper {
  background-color: rgba(211, 211, 211, 0.35);
  border: 1px solid rgba(211, 211, 211, 0.61);
  padding: 7px;
  width: 100%;
}
.back-button {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  i {
    font-size: 30px;
  }
}
.file-fab {
  margin-top: 16px;
}
.file-fab.v-btn--left {
  margin-left: -16px;
}
.file-fab.v-btn--right {
  margin-right: -16px;
}
</style>
