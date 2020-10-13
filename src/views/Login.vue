<template>
  <v-layout fill-height fluid class="blue darken-1">
    <v-row align="center"
           justify="center">
      <v-card  align="center" class="px-10 py-5 blue darken-1" elevation="0">
        <LoginDialog button-text="Accedi Come Paziente"
                     headline-text="Accesso Pazienti"
                     :login-call-back="this.patientLogin"
        />
        <LoginDialog button-text="Accedi Come Dottore"
                     headline-text="Accesso Dottori"
                     :login-call-back="this.doctorLogin"
        />
        <LoginDialog button-text="Accedi Come Operatore Sanitario"
                     headline-text="Accesso Operatori Sanitari"
                     :login-call-back="this.operatorLogin"
        />
      </v-card>
    </v-row>
  </v-layout>
</template>

<script>
import api from '@/services/api/';
import LoginDialog from '@/components/login/LoginDialog.vue';
import { mapState } from 'vuex';

export default {
  name: 'Login',
  components: { LoginDialog },
  mounted() {
    if (this.user && this.user.id) {
      switch (this.user.type) {
        case 'patient': this.$router.push({ path: '/patient_home' }); break;
        default: break;
      }
    }
  },
  computed: mapState(['user']),
  watch: {
    user(newValue) {
      if (newValue && newValue.id) {
        switch (newValue.type) {
          case 'patient': this.$router.push({ path: '/patient_home' }); break;
          default: break;
        }
      }
    },
  },
  methods: {
    async patientLogin(email, password) {
      const user = await api.login(email, password);
      this.$store.commit('setUser', user);
      await this.$router.push({ path: '/patient_home' });
    },
    doctorLogin() {
      console.log('patient login called');
    },
    operatorLogin() {
      console.log('patient login called');
    },
  },
};
</script>

<style scoped>

</style>
