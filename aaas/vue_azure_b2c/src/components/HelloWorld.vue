<template>
  <div>
    <div id="label">Sign-in with Microsoft Azure AD B2C</div>

    <button @click="login" v-if="!isAuth">Login</button>
    <button @click="logout" v-if="isAuth">Logout</button>

    <div v-if="isAuth">You have successfully signed in.</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      isAuth: false,
    };
  },
  methods: {
    login() {
      let parent = this;
      let loginPromise = this.$AuthService.login();

      loginPromise.then((isAuthenticated) => {
        parent.isAuth = isAuthenticated;
      });
    },
    logout() {
      this.$AuthService.logout();
    },
  },
  watch: {
    isAuth: function () {
      return this.isAuth;
    },
  },
};
</script>
