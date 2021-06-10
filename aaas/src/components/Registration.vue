<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div v-if="!isSignedIn">
          <v-btn @click="login">login</v-btn>
        </div>
        <div v-else>
          <v-btn @click="logout">logout</v-btn>
          <v-btn @click="obtainToken">getToken</v-btn>
          <v-btn @click="getWelcomeMessage({ name: 'stef Ruinard' })"
            >getWelcomeMessage</v-btn
          >

          <h3>Your Access Token:</h3>
          <h5>{{ accessToken }}</h5>
          <h5>{{ welcomeMessage }}</h5>
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
    ...mapActions(["login", "logout", "obtainToken", "getWelcomeMessage"]),
    ...mapGetters(["isAuth"]),
  },
  computed: {
    welcomeMessage() {
      return this.$store.state.welcome;
    },
    isSignedIn() {
      return this.isAuth();
    },
    accessToken() {
      return this.$store.state.accessToken;
    },
  },
};
</script>
