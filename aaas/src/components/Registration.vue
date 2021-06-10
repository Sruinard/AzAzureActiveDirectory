<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div v-if="!isSignedIn">
          <h3>Login to get an access token.</h3>
        </div>
        <div v-else>
          <v-btn @click="obtainToken">Get Your Access Token</v-btn>
          <h3>Your Access Token:</h3>
          <h5>{{ accessToken }}</h5>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Registration",
  methods: {
    ...mapActions(["obtainToken"]),
    ...mapGetters(["isAuth"]),
  },
  computed: {
    isSignedIn() {
      return this.isAuth();
    },
    accessToken() {
      return this.$store.state.accessToken;
    },
  },
};
</script>
