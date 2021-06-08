import * as msal from "@azure/msal-browser";
import config from "../config";
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: "e533862b-c801-48e9-a473-c9fda98802d4",
    // authority: "https://login.microsoftonline.com/common",
    authority:
      "https://sruinardorg.b2clogin.com/sruinardorg.onmicrosoft.com/B2C_1_abc",
    knownAuthorities: ["sruinardorg.b2clogin.com"],
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
const apiConfig = {
  b2cScopes: ["https://sruinardorg.onmicrosoft.com/helloapi/demo.read"],
  webApi: "https://fabrikamb2chello.azurewebsites.net/hello",
};
const loginRequest = {
  scopes: ["openid", "offline_access", "e533862b-c801-48e9-a473-c9fda98802d4"],
};

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
    this.username = "";
    this.accessToken = "";
  }
  obtainToken(account) {
    let tokenRequest = {
      scopes: ["user.read"],
      account: account,
    };
    this.app.acquireTokenSilent(tokenRequest).then((accessTokenResponse) => {
      // Acquire token silent success
      this.accessToken = accessTokenResponse.accessToken;
      console.log(this.accessToken);
    });
  }
  login() {
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    this.app
      .loginPopup(loginRequest)
      .then((response) => {
        this.username = "stefruinard";

        let tokenRequest = {
          scopes: [
            "openid",
            "offline_access",
            "e533862b-c801-48e9-a473-c9fda98802d4",
          ],
          account: response.account,
        };
        this.app
          .acquireTokenSilent(tokenRequest)
          .then((accessTokenResponse) => {
            // Acquire token silent success
            this.accessToken = accessTokenResponse.accessToken;
            console.log("You are rocking: ", accessTokenResponse);
            console.log(this.accessToken);
          });

        return this.username;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  logout() {
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    const logoutRequest = {
      account: this.app.getAccountByUsername(this.username),
      postLogoutRedirectUri: msalConfig.auth.redirectUri,
      mainWindowRedirectUri: msalConfig.auth.redirectUri,
    };

    this.app.logoutPopup(logoutRequest);
  }

  selectAccount() {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = this.app.getAllAccounts();

    if (currentAccounts.length < 1) {
      return;
    } else if (currentAccounts.length > 1) {
      /**
       * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
       * is cached as a new account, which results in more than one account in the cache. Here we make
       * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow,
       * as this is the default flow the user initially signed-in with.
       */
      const accounts = currentAccounts.filter((account) =>
        account.homeAccountId
          .toUpperCase()
          .includes(
            msalConfig.auth.authority.toUpperCase() &&
              account.idTokenClaims.iss.toUpperCase()
          )
      );

      if (accounts.length > 1) {
        // localAccountId identifies the entity for which the token asserts information.
        if (
          accounts.every(
            (account) => account.localAccountId === accounts[0].localAccountId
          )
        ) {
          // All accounts belong to the same user
          this.username = accounts[0].username;
        } else {
          // Multiple users detected. Logout all to be safe.
          this.logout();
        }
      } else if (accounts.length === 1) {
        this.username = accounts[0].username;
      }
    } else if (currentAccounts.length === 1) {
      this.username = currentAccounts[0].username;
    }
  }
}

export default msalObject;
// Create an instance of PublicClientApplication
// const msalInstance = new PublicClientApplication(msalConfig);

// // Handle the redirect flows
// msalInstance
//   .handleRedirectPromise()
//   .then((tokenResponse) => {
//     // Handle redirect response
//   })
//   .catch((error) => {
//     // Handle redirect error
//   });

// export default class AuthService {
//   constructor() {
//     this.applicationConfig = {
//       clientID: config.clientid,
//       authority: config.authority,
//     };
//     this.app = new Msal.UserAgentApplication(
//       this.applicationConfig.clientID,
//       this.applicationConfig.authority
//     );
//   }

//   login() {
//     this.app.loginPopup().then(
//       (token) => {
//         console.log("JWT token " + token);
//       },
//       (error) => {
//         console.log("Login error " + error);
//       }
//     );
//   }

//   logout() {
//     this.app._user = null;
//     this.app.logout();
//   }

//   getUser() {
//     return this.app.getUser();
//   }
// }
