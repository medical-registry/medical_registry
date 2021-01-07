<template>
  <v-container fluid>
    <v-container class="mb-12 pa-3 pa-sm-3 pa-md-8" v-if="patientProfile">
      <v-card class="pa-10 mb-10">
        <v-row align="center" justify="start">
          <v-flex md2 sm2 xs3>
            <v-avatar v-bind:size=isMobile?64:100>
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                v-bind:alt="`${patientProfile.name} ${patientProfile.surname}`"
              >
            </v-avatar>
          </v-flex>
          <v-flex md6 sm5 xs4>
            <v-card-text class="px-sm-2 px-md-8 px-2">
                <span class="text-md-h4 text-sm-h4 text-h7  font-weight-bold">
                  {{patientProfile.name}} {{patientProfile.surname}}
                </span>
              <br/>
              <span class="text-md-h5 text-sm-h7 text-h8">
                  {{patientProfile.code}}
                </span>
            </v-card-text>
          </v-flex>
          <v-flex md4 sm5 xs5>
            <ProfileField
              v-for="datum in filterProfileFields('top')"
              :key="datum.field"
              :datum="datum"
              :profile="patientProfile"
              align="right"
            />
          </v-flex>
        </v-row>
        <v-row>
          <v-tabs v-model="tab" background-color="transparent" class="elevation-0 mt-5" grow md12>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#info">
              Info
            </v-tab>
            <v-tab href="#contacts">
              Contatti
            </v-tab>
            <v-tab-item value="info"  class="mt-10">
              <v-layout row wrap justify-start >
                <v-col :md="datum.fullWidth? 12: 4"
                       :sm="datum.fullWidth? 12: 6"
                       cols="12"
                       v-for="datum in filterProfileFields('info')"
                       :key="datum.field">
                  <profile-field v-if="datum.field != null" :datum="datum"
                                 :profile="patientProfile"/>
                </v-col>
              </v-layout>
              <p class="text-md-body-1 text-sm-body-2 text-body-2 font-weight-bold mt-4">
                Allergie
              </p>
              <AddAllergyDialog :on-add="fetchData" :user-id="user.id"
                                :editing-record="allergy"
                                v-for="allergy in allergies" :key="allergy.id_allergy"/>
              <AddAllergyDialog :on-add="fetchData" :user-id="user.id"/>
            </v-tab-item>
            <v-tab-item value="contacts">
             <Contacts :profile="patientProfile"/>
            </v-tab-item>
          </v-tabs>
        </v-row>
      </v-card>
      <v-layout row wrap>
        <v-flex md4 sm12>
          <ActiveTimeline
            type="exams"
            :user-id="patientProfile.id"
            title="Prossimi Esami/Visite"/>
        </v-flex>
        <v-flex md4 sm12>
            <ActiveTimeline
              type="diagnosis"
              :user-id="patientProfile.id"
              title="Diagnosi Attive"/>
        </v-flex>
        <v-flex md4 sm12>
            <ActiveTimeline
              type="prescriptions"
              :user-id="patientProfile.id"
              title="Prescrizioni Attive"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>

import api from '@/services/api/';
import moment from 'moment';
import { resolveCountryByCode } from '@/services/util';
import ProfileField from '@/components/home/ProfileField.vue';
import ActiveTimeline from '@/components/home/ActiveTimeline.vue';
import Contacts from '@/components/home/Contacts.vue';
import AddAllergyDialog from '@/components/home/AddAllergyDialog.vue';

const computeAge = (date) => moment(Date.now()).diff(date, 'years');

const isFieldPresent = (profile, fieldName) => profile[fieldName] !== '' && profile[fieldName] !== '';

const fields = [
  { field: 'sex', displayName: 'Sesso', section: 'top' },
  { field: 'birthdate', displayName: 'Data di Nascita', section: 'info' },
  {
    field: 'weight',
    displayName: 'Peso',
    computed: true,
    extractor: (profile) => `${profile.peso}Kg`,
    section: 'top',
  },
  {
    field: 'height',
    displayName: 'Altezza',
    computed: true,
    extractor: (profile) => `${profile.altezza}cm`,
    section: 'top',
  },
  {
    field: 'age',
    displayName: 'Età',
    fullWidth: false,
    computed: true,
    extractor: (profile) => `${computeAge(profile.birthdate)} anni`,
    section: 'top',
  },
  { field: 'blood_group', displayName: 'Gruppo Sanguigno', section: 'top' },
  {
    field: 'country_mother',
    displayName: 'Nazionalità Materna',
    extractor: (profile) => resolveCountryByCode(profile.country_mother),
    section: 'info',
  },
  {
    field: 'country_father',
    displayName: 'Nazionalità Paterna',
    extractor: (profile) => resolveCountryByCode(profile.country_father),
    section: 'info',
  },
  {
    field: 'full_address',
    displayName: 'Indirizzo',
    fullWidth: false,
    computed: true,
    extractor: (profile) => `${profile.address},
      ${profile.zip_code} ${profile.city},
      ${resolveCountryByCode(profile.country)}`,
    section: 'info',
  },
  {
    field: 'particular_signs',
    displayName: 'Segni Particolari',
    fullWidth: false,
    section: 'info',
  },
  { field: 'telephone_1', displayName: 'Telefono', section: 'contacts' },
  { field: 'telephone_2', displayName: 'Telefono 2', section: 'contacts' },
  { field: 'email', displayName: 'Email', section: 'contacts' },
  {
    field: 'urgent_info',
    displayName: 'Informazioni Urgenti',
    fullWidth: true,
    section: 'info',
  },
];
export default {
  name: 'Home',
  components: {
    AddAllergyDialog, Contacts, ActiveTimeline, ProfileField,
  },
  data() {
    return {
      isMobile: false,
      loading: true,
      patientProfile: null,
      error: null,
      fields,
      tab: null,
      allergies: null,
      user: this.$store.state.user,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.patientProfile = await api.fetchPatientProfile(this.user.id);
      this.allergies = await api.fetchUserAllergies(this.user.id);
      this.allergies = this.allergies.map((allergy) => ({
        ...allergy,
        color: this.selectAllergyColor(allergy),
        textColor: allergy.to ? 'black' : 'white',
      }));
      this.loading = false;
    },
    selectAllergyColor(allergy) {
      if (allergy.to) {
        return 'gray';
      }
      switch (allergy.severity) {
        case 'BASSA': return 'yellow darken-2';
        case 'MEDIA': return 'orange darken-2';
        case 'ALTA': return 'deep-orange darken-2';
        default: return 'gray';
      }
    },
    filterProfileFields(section) {
      return fields.filter((datum) => datum.section === section
        && isFieldPresent(this.patientProfile, datum.field));
    },
    onResize() {
      this.isMobile = window.innerWidth < 960;
    },
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },

  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
};
</script>
