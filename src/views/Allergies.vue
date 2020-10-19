<template>
<v-card>
      <v-card-title>Allergie </v-card-title>
        <v-timeline  align-top dense>
          <v-timeline-item v-for="item in items" :key="item.id_care" small>
            <v-card elevation="0" v-if="!editing" :key="allergy.id_care">

              <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.allergy.name}}
              ({{item.allergy.category}})</v-card-title>
            <v-card-title v-if="!item.to" class="headline capitalized">{{formatDate(item.from)}}
            </v-card-title>
            <v-card-title v-else class="headline capitalized">Dal {{formatDate(item.from)}}
              al {{formatDate(item.to)}}
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                          <tr>
                            <th class="text-left">Intolleranza</th>
                            <th class="text-left">Severità</th>
                            <th v-if="item.note" class="text-left">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td v-if="item.intolerance=='N'">No</td>
                        <td v-else>Si</td>
                        <td>{{item.severity}}</td>
                        <td v-if="item.note">{{item.note}}</td>
                        <td class="text-right">
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-2" @click="editing=true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="error" fab x-small dark elevation="0" @click="deleteAllergy">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </td>
                        <td colspan="4"/>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-card-text>

    </v-card></v-card>
    <v-card v-else>
      <td class="pa-0 px-2">
      <AutocompleteSearch
            invalid-hint="Seleziona Allergia"
            label="Allergia"
            :table="database.allergy_register"
            :required="true"
            v-on:change="updateAllergy"
            :initial-value="def"
        />
      </td>
      <td class="pa-0 px-2">
      <v-text-field label="Severità" v-model="item.severity" type="text"/>
    </td>
      <td>
      <v-checkbox v-model="item.intolerance" label="Intolleranza"/>
    </td>
    <td class="pa-0 px-2">
      <v-text-field label="Note" v-model="item.note" type="text"/>
    </td>
    <td class="text-right">
      <v-btn color="error" fab x-small dark elevation="0" @click="editing = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn color="primary" fab x-small dark elevation="0" class="mr-0 ml-3" @click="save()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </td>
    </v-card>
        </v-timeline-item>
      </v-timeline>
            </v-card>
</template>

<script>
import { keyBy } from '@/services/util';
import db from '@/services/database';
import moment from 'moment';
import AutocompleteSearch from '@/components/AutocompleteSearch.vue';

export default {
  name: 'Allergies',
  components: { AutocompleteSearch },
  props: {
    items: null,
    category: null,
    intolerance: null,
    severity: null,
    note: null,
  },
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchAllergies() {
      const userAllergies = await db.allergies
        .where({ id_person: this.$store.state.user.id }).toArray();
      const allergyIds = [...new Set(userAllergies.map((item) => item.id_allergy))];
      const allergyRegister = await db.allergy_register.bulkGet(allergyIds);
      const keyedAllergyDefinitions = keyBy(allergyRegister, 'id');
      this.items = userAllergies.map((item) => ({
        ...item,
        allergy: keyedAllergyDefinitions[item.id_allergy],
      }));
    },
    async deleteAllergy() {
      await this.database.allergies.where({ id_care: this.allergy.id_care }).delete();
      this.$emit('delete');
    },
    async save() {
      if (this.parent) {
        this.allergy.creation = moment().format();
      }
      this.exam.update = moment().format();
      if (this.allergy.id_care) {
        await this.database.allergies.update(this.allergy.id_care, this.allergy);
      } else {
        await this.database.allergies.put(this.allergy);
      }
      this.editing = false;
      this.$emit('update');
    },
    updateAllergy(def) {
      if (!def) { return; }
      this.def = def;
      this.allergy.id_allergy = def.id;
      this.allergy.name = def.name;
    },
  },
  data() {
    let data;
    if (this.parent) {
      data = { ...this.parent };
      delete data.id_care;
      delete data.id_allergy;
      delete data.intolerance;
      delete data.severity;
      delete data.name;
      delete data.category;
      delete data.note;
    } else {
      data = { ...this.item };
    }
    delete data.allergy;
    return {
      editing: this.parent !== undefined,
      def: this.item ? this.item.allergy : null,
      database: db,
      allergy: data,
    };
  },
  created() {
    this.fetchAllergies();
  },
};
</script>
<style scoped>
</style>
