<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <div class="my-5 light-blue--text">
        <v-btn color="primary lighten-1" dark v-bind="attrs" v-on="on">
         {{buttonText}}
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{headlineText}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Email" required type="email" v-model="email"/>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password"
                type="password"
                required
                v-model="password"/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="login()">Accedi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: {
    buttonText: null,
    headlineText: null,
    loginCallBack: null,
  },
  methods: {
    login() {
      this.dialog = false;
      this.loginCallBack(this.email, this.password);
    },
  },
  data() {
    return {
      dialog: false,
      email: null,
      password: null,
    };
  },
};
</script>
