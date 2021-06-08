<template>
  <div>
    <div id="label">Sign-in with Microsoft Azure AD B2C</div>

    <button @click="login" v-if="!user">Login</button>
    <button @click="logout" v-if="user">Logout</button>

    <button @click="token">token</button>
    <div v-if="user">Hello from Vue.js. User is {{ user }}</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      name: "",
    };
  },
  created() {
    this.$AuthService.selectAccount();
  },
  methods: {
    token() {
      console.log("gettign token");
      let account = this.$AuthService.app.getAllAccounts()[0];
      console.log("account is:", account);
      this.$AuthService.obtainToken(account);
    },
    login() {
      this.name = "";
      this.$AuthService.login();
      this.name = this.$AuthService.username;
      console.log("something1", this.name);
      this.name = "stefruinard";
      console.log("something2", this.name);
    },
    logout() {
      this.$AuthService.logout();
    },
  },
  computed: {
    user: function () {
      if (this.name != "") {
        console.log("hello!!!!!!");
      }
      console.log(this.name);
      return this.name;
      // return this.name;
    },
  },
};
</script>
