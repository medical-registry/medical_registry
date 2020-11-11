<template>
  <v-container>
    <div class="text-h6 mt-5 mb-0 font-weight-regular" v-if="doctor">
      Medico Curante<br>
      <span class="text-h6 font-weight-bold">{{doctor.name}} {{doctor.surname}}</span>
      <span v-if="doctor.title" class="text-h7 font-weight-regular">, {{doctor.title}}</span>
      <br>
    </div>
    <v-row wrap justify-start  class="mt-0 mb-7">
      <v-col class="pt-0">
        <span class="text-subtitle-2 capitalized">
          <v-icon color="black" small>mdi-map-marker</v-icon>
          {{doctor.location.name}},
          {{doctor.location.address}},
          {{doctor.location.zip_code}},
          {{doctor.location.city}}<br>
          <v-icon color="black" small>mdi-phone</v-icon> {{doctor.location.phone}}
        </span>
      </v-col>
    </v-row>
    <span class="text-h6 font-weight-regular">Contatti Personali</span>
    <v-row wrap justify-start  class="mt-2">
      <v-col v-if="profile.telephone_1 && profile.telephone_1.trim() !== ''" md="4">
        <v-icon color="black">mdi-phone</v-icon>
        {{profile.telephone_1}}
      </v-col>
      <v-col v-if="profile.telephone_1 && profile.telephone_1.trim() !== ''" md="4">
        <v-icon color="black">mdi-phone</v-icon>
        {{profile.telephone_2}}
      </v-col>
      <v-col v-if="profile.email"><v-icon>mdi-at</v-icon> {{profile.email}}</v-col>
    </v-row>
    <div class="text-h6 mt-5 font-weight-regular" v-if="contacts && contacts.length>0">
      Altri Contatti
    </div>
    <v-row wrap justify-start  class="mt-2" v-if="contacts && contacts.length>0">
      <v-col v-for="contact in contacts" :key="`concact_${contact.id_contact}`" md="4" class="pt-0">
        <span class="subtitle-2">{{contact.name}}</span><br>
        <v-icon color="black" v-if="contact.typology === 'telefono'">mdi-phone</v-icon>
        <v-icon color="black" v-if="contact.typology === 'email'">mdi-at</v-icon>
        {{contact.contact}}<br>
        <span class="caption" v-if="contact.note && contact.note !== ''">{{contact.note}}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import db from '@/services/database';

export default {
  name: 'Contacts',
  props: {
    profile: null,
  },
  mounted() {
    this.loadContacts();
  },
  methods: {
    async loadContacts() {
      this.contacts = await db.contact
        .where({ id_person: this.profile.id_person })
        .toArray();
      if (this.profile.id_doctor) {
        const doctor = await db.doctor_register
          .get({ id: this.profile.id_doctor });
        doctor.location = await db.location_register
          .get({ id: doctor.id_location });
        this.doctor = doctor;
      }
    },
  },
  data() {
    return {
      contacts: null,
      doctor: null,
    };
  },
};
</script>

<style scoped>

</style>
