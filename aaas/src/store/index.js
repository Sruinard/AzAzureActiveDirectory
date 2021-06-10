import Vue from "vue";
import Vuex from "vuex";
import * as msal from "@azure/msal-browser";
import axios from "axios";
Vue.use(Vuex);

const baseURL = "https://apim-we-micrard.azure-api.net";
// const baseURL = "https://cawebappdemo31596.azurewebsites.net";
const msalConfig = {
  auth: {
    clientId: "77ff80ab-8f95-42e3-a3e7-cda0df14b991",
    authority:
      "https://micrard.b2clogin.com/micrard.onmicrosoft.com/B2C_1_micrard",
    knownAuthorities: ["micrard.b2clogin.com"],
    // redirectUri: "http://localhost:8080",
    redirectUri: "https://ambitious-hill-0f31b8f03.azurestaticapps.net",
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
    login(context, state) {
      clientApp.loginPopup(state.loginRequest).then((response) => {
        context.commit("setAccount", response.account);
        context.commit("setIsAuth", true);
        console.log(response.account);
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
    obtainToken({ commit, state }) {
      let tokenRequest = Object.assign(
        { account: state.account },
        state.loginRequest
      );
      clientApp.acquireTokenSilent(tokenRequest).then((accessTokenResponse) => {
        commit("setAccessToken", accessTokenResponse.accessToken);
      });
    },
    async getCabs({ commit, state }, data) {
      const content = await axios.get(`${baseURL}/api/cabs?city=${data.city}`, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log(content.data);
      commit("setCabs", content.data);
    },
    async postCab(context, data) {
      const content = await axios.post(`${baseURL}/api/cabs`, {
        city: data.city,
        is_available: true,
      });
      console.log(content);
      console.log(data);
      context.commit("setCabs", content.data);
    },
  },
  mutations: {
    setAccessToken(state, token) {
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
