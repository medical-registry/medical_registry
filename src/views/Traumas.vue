<template>

    <v-card elevation="0">
      <v-card-title>Traumi </v-card-title>
      <v-timeline  align-top dense>
        <v-timeline-item v-for="item in items" :key="item.id_trauma" small>
          <v-card class="elevation-3">
            <v-card-title class="text-center">{{item.name}}</v-card-title>
            <v-card-title v-if="!item.to" class="headline capitalized">{{formatDate(item.from)}}
            </v-card-title>
            <v-card-title v-else class="headline capitalized">Dal {{formatDate(item.from)}}
              al {{formatDate(item.to)}}
            <v-card-title v-if="item.time" class="headline capitalized">Orario:
                {{item.name}}</v-card-title>
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                          <tr>
                            <th v-if="item.severity" class="text-left">Severità</th>
                            <th v-if="item.body_impacted" class="text-left">
                              Parte del corpo</th>
                            <th v-if="item.description" class="text-left">Descrizione</th>
                            <th v-if="item.note" class="text-left" style="width: 500px">Note</th>
                            <th colspan="2"/>
                          </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-if="item.severity" class="text-left">
                              {{item.severity}}</td>
                <td v-if="item.body_impacted" class="text-left">{{item.body_impacted}}</td>
                            <td v-if="item.description" class="text-left">
                              {{item.description}}</td>
                            <td v-if="item.note" class="text-left">{{item.note}}</td>
                        <td colspan="4"/>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>

    </v-card>

</template>

<script>
import db from '@/services/database';
import moment from 'moment';

export default {
  name: 'Traumas',
  methods: {
    formatDate: (value) => moment(value).format('LL'),
    async fetchTraumas() {
      const userTraumas = await db.traumas
        .where({ id_person: this.$store.state.user.id }).toArray();
      this.items = userTraumas;
      // const allergyIds = [...new Set(userTraumas.map((item) => item.id_allergy))];
      // const allergyRegister = await db.allergy_register.bulkGet(allergyIds);
      // const keyedAllergyDefinitions = keyBy(allergyRegister, 'id');
      // this.items = userTraumas.map((item) => ({
      //  ...item,
      //  allergy: keyedAllergyDefinitions[item.id_allergy],
      // }));
    },
  },
  data() {
    return {
      database: db,
      items: null,
    };
  },
  created() {
    this.fetchTraumas();
  },
};
</script>
