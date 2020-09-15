<template>
    <v-container
      class="md8 mb-12 pa-3 pa-sm-3 pa-md-8"
    >
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
              <span  class="text-md-h5 text-sm-h7 text-h8">
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
          <v-tabs
            v-model="tab"
            background-color="transparent"
            class="elevation-0 mt-5"
            grow
            md12
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#info">
              Info
            </v-tab>
            <v-tab href="#contacts">
              Contatti
            </v-tab>
            <v-tab-item value="info">
              <v-layout row wrap justify-start  class="mt-2">
                <v-col :md="datum.fullWidth? 12: 4"
                       :sm="datum.fullWidth? 12: 6"
                       cols="12"
                       v-for="datum in filterProfileFields('info')"
                       :key="datum.field">
                  <profile-field :datum="datum" :profile="patientProfile"/>
                </v-col>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="contacts">
              <v-layout row wrap justify-start  class="mt-2">
                <v-col :md="datum.fullWidth? 12: 4"
                       :sm="datum.fullWidth? 12: 6"
                       cols="12"
                       v-for="datum in filterProfileFields('contacts')"
                       :key="datum.field">
                  <profile-field :datum="datum" :profile="patientProfile"/>
                </v-col>
                <v-col md="4"
                       sm="6"
                       cols="12"
                       v-for="(contact,idx) in patientContacts"
                       :key="idx">
                  <profile-field :display-name="`${contact.name} (${contact.note})`"
                                 :value="contact.contact"/>
                </v-col>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-row>
      </v-card>
      <v-layout row wrap>
        <v-flex md4 sm12>
          <ActiveTimeline
            type="allergies"
            :user-id="patientProfile.id"
            title="Allergie Attive"
          />
        </v-flex>
        <v-flex md4 sm12>
            <ActiveTimeline
              type="diagnosis"
              :user-id="patientProfile.id"
              title="Diagnosi Attive"
            />
        </v-flex>
        <v-flex md4 sm12>
            <ActiveTimeline
              type="prescriptions"
              :user-id="patientProfile.id"
              title="Prescrizioni Attive"
            />
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

import api from '@/services/api/';
import moment from 'moment';
import { resolveCountryByCode } from '@/services/util';
import ProfileField from '@/components/home/ProfileField.vue';
import ActiveTimeline from '@/components/home/ActiveTimeline.vue';

const computeAge = (date) => moment(Date.now()).diff(date, 'years');

const isFieldPresent = (profile, fieldName) => profile[fieldName] !== '' && profile[fieldName] !== '';

const fields = [
  { field: 'sex', displayName: 'Sesso', section: 'top' },
  { field: 'birthdate', displayName: 'Data di Nascita', section: 'info' },
  {
    field: 'age',
    displayName: 'Età',
    fullWidth: false,
    computed: true,
    extractor: (profile) => computeAge(profile.birthdate),
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
    fullWidth: true,
    computed: true,
    extractor: (profile) => `${profile.address},
      ${profile.zip_code} ${profile.city},
      ${resolveCountryByCode(profile.country)}`,
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
  {
    field: 'particular_signs',
    displayName: 'Segni Particolari',
    fullWidth: true,
    section: 'info',
  },

];
export default {
  name: 'Home',
  // eslint-disable-next-line vue/no-unused-components
  components: { ActiveTimeline, ProfileField },
  computed: {
    user() {
      return this.$store.user;
    },
  },
  data() {
    return {
      isMobile: false,
      loading: true,
      patientProfile: null,
      patientContacts: [],
      error: null,
      fields,
      tab: null,
    };
  },
  created() {
    this.fetchData();
    this.fetchContacts();
  },
  methods: {
    fetchData() {
      api.fetchPatientProfile()
        .then((response) => {
          this.patientProfile = response.data;
          this.loading = false;
        });
    },
    fetchContacts() {
      api.fetchUserContacts()
        .then((response) => {
          this.patientContacts = response.data;
        });
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
