<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn text to="/">Home</v-btn>
        <v-btn v-if="isAuth" text to="/cabs">Cabs</v-btn>
      </div>

      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-btn v-if="isAuth" text @click="logout">logout</v-btn>
        <v-btn v-else text @click="login">login</v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapActions(["login", "logout"]),
  },

  computed: {
    isAuth() {
      return this.$store.state.isAuth;
    },
  },
};
</script>
