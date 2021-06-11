import Vue from "vue";
import Vuex from "vuex";
import * as msal from "@azure/msal-browser";
import axios from "axios";
Vue.use(Vuex);

const baseURL = "https://apim-we-micrard.azure-api.net";
const clientId = "77ff80ab-8f95-42e3-a3e7-cda0df14b991";
const authority =
  "https://micrard.b2clogin.com/micrard.onmicrosoft.com/B2C_1_micrard";
const knownAuthorities = ["micrard.b2clogin.com"];
// const redirectUri = "http://localhost:8080";
const redirectUri = "https://ambitious-hill-0f31b8f03.azurestaticapps.net";

const msalConfig = {
  auth: {
    clientId: clientId,
    authority: authority,
    knownAuthorities: knownAuthorities,
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

let clientApp = new msal.PublicClientApplication(msalConfig);

export default new Vuex.Store({
  state() {
    return {
      account: {},
      cabs: [],
      accessToken: "",
      isAuth: false,
      loginRequest: {
        scopes: [
          "openid",
          "offline_access",
          "77ff80ab-8f95-42e3-a3e7-cda0df14b991",
        ],
      },
    };
  },
  getters: {
    isAuth(state) {
      return state.isAuth;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
  },
  actions: {
    login({ commit, state, dispatch }) {
      clientApp.loginPopup(state.loginRequest).then((response) => {
        commit("setAccount", response.account);
        commit("setIsAuth", true);
        dispatch("obtainToken");
      });
    },
    logout(context) {
      const logoutRequest = {
        account: clientApp.getAccountByUsername(),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
        mainWindowRedirectUri: msalConfig.auth.redirectUri,
      };

      clientApp.logoutPopup(logoutRequest);
      context.commit("setAccount", {});
      context.commit("setIsAuth", false);
      context.commit("setAccessToken", "");
    },
    async obtainToken({ commit, state }) {
      let tokenRequest = Object.assign(
        { account: state.account },
        state.loginRequest
      );
      clientApp.acquireTokenSilent(tokenRequest).then((accessTokenResponse) => {
        commit("setAccessToken", accessTokenResponse.accessToken);
      });
    },
    async getCabs({ commit }, data) {
      const content = await axios.get(`${baseURL}/api/cabs/?city=${data.city}`);
      commit("setCabs", content.data);
    },
    async postCab(context, data) {
      const content = await axios.post(`${baseURL}/api/cabs`, {
        city: data.city,
        is_available: true,
      });
      context.commit("setCabs", [content.data]);
    },
  },
  mutations: {
    setAccessToken(state, token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      state.accessToken = token;
    },
    setAccount(state, account) {
      state.account = account;
    },
    setIsAuth(state, isAuth) {
      state.isAuth = isAuth;
    },
    setCabs(state, content) {
      state.cabs = content;
    },
  },
});
