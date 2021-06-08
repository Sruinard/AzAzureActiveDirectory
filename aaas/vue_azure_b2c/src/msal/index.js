import * as msal from "@azure/msal-browser";
import config from "../config";
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: "77ff80ab-8f95-42e3-a3e7-cda0df14b991",
    // authority: "https://login.microsoftonline.com/common",
    authority:
      "https://micrard.b2clogin.com/micrard.onmicrosoft.com/B2C_1_micrard",
    knownAuthorities: ["micrard.b2clogin.com"],
    redirectUri: "http://localhost:8080",
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

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
// const loginRequest = {
//   scopes: ["User.Read"],
// };
// const apiConfig = {
//   b2cScopes: ["https://micrard.onmicrosoft.com/helloapi/demo.read"],
// webApi: "https://fabrikamb2chello.azurewebsites.net/hello",
// };
// const loginRequest = {
//   scopes: ["openid", "offline_access", "77ff80ab-8f95-42e3-a3e7-cda0df14b991"],
// };

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
// const tokenRequest = {
//   scopes: ["User.Read", "Mail.Read"],
//   forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
// };
class msalObject {
  constructor() {
    this.app = new msal.PublicClientApplication(msalConfig);
    this.isAuthenticated = false;
    this.accessToken = "";
    this.loginRequest = {
      scopes: [
        "openid",
        "offline_access",
        "77ff80ab-8f95-42e3-a3e7-cda0df14b991",
      ],
    };
  }
  obtainToken(account) {
    let tokenRequest = Object.assign({ account: account }, this.loginRequest);
    this.app.acquireTokenSilent(tokenRequest).then((accessTokenResponse) => {
      this.accessToken = accessTokenResponse.accessToken;
    });
    return this.accessToken;
  }
  async login() {
    var parent = this;
    await this.app
      .loginPopup(this.loginRequest)
      .then((response) => {
        parent.obtainToken(response.account);
        parent.isAuthenticated = true;
        console.log("AUTHENTICATED", parent.isAuthenticated);
        return parent.isAuthenticated;
      })
      .catch((error) => {
        console.error(error);
      });

    return this.isAuthenticated;
  }
  logout() {
    const logoutRequest = {
      account: this.app.getAccountByUsername(this.username),
      postLogoutRedirectUri: msalConfig.auth.redirectUri,
      mainWindowRedirectUri: msalConfig.auth.redirectUri,
    };

    this.app.logoutPopup(logoutRequest);
    this.isAuthenticated = false;
  }
}

export default msalObject;
