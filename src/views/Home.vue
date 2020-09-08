<template>
  <v-container grid-list-md text-xs-center class="align-top">
    <v-layout v-if="patientProfile" row wrap>
      <v-flex md12>
        <v-card>
          <v-container px="10">
            <v-layout row wrap>
              <v-flex md2 sm2 xs2>
                <v-avatar v-bind:size=isMobile?64:128>
                  <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    v-bind:alt="`${patientProfile.name} ${patientProfile.surname}`"
                  >
                </v-avatar>
              </v-flex>
              <v-flex md5 sm5 xs5>
                <v-card-text class="px-0">
                  <span class="text-md-h4 text-h6">
                    {{patientProfile.name}} {{patientProfile.surname}}
                  </span>
                  <br/>
                  <span  class="text-md-h5 text-h7">
                    {{patientProfile.code}}
                  </span>
                </v-card-text>
              </v-flex>
              <v-flex md5 sm5 xs5 style="padding-right: 10px">
                <ProfileField
                  v-for="datum in filterProfileFields('top')"
                  :key="datum.field"
                  :datum="datum"
                  :profile="patientProfile"
                  align="right"
                />
              </v-flex>
            </v-layout>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              class="elevation-0 px-5"
              grow
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
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md6 sm12>
          <ActiveTimeline
            type="diagnosis"
            :user-id="patientProfile.id"
            title="Diagnosi Attive"
          />
      </v-flex>
      <v-flex md6 sm12>
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
  components: { ActiveTimeline, ProfileField },
  computed: {
    user() {
      return this.store.user;
    },
  },
  data() {
    return {
      isMobile: false,
      loading: true,
      patientProfile: null,
      error: null,
      fields,
      tab: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      api.fetchPatientProfile()
        .then((response) => {
          this.patientProfile = response.data;
          this.loading = false;
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
