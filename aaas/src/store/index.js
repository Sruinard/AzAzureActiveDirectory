import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: "a37965af-0949-4776-b9ec-6b41af29b777",
          authority: "https://login.microsoftonline.com/common",
        },
        cache: {
          cacheLocation: "localStorage",
        },
      },
      accessToken: "",
    };
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
});
