import * as msal from "@azure/msal-browser";

const TENANTID = "3165d8fc-5157-474b-846b-492706e7b40e";

const msalConfig: msal.Configuration = {
  auth: {
    clientId: "9749ec7b-e520-46bd-b65b-92bb527471e6",
    authority: `https://login.microsoftonline.com/${TENANTID}`,
    knownAuthorities: [
      "login.microsoftonline.com",
    ],
    redirectUri: "http://localhost:3000/",
    postLogoutRedirectUri: "http://localhost:3000/",
    navigateToLoginRequestUrl: false
  },
};

const REQUEST = {
  scopes: [
    "api://mr-josh/scoreboard",
  ],
};

const Auth = new msal.PublicClientApplication(msalConfig);

const loginRedirect = () => {
  Auth.loginRedirect(REQUEST);
};

const getTokens = async () => {
  if (!Auth.getActiveAccount()) {
    for (const account of Auth.getAllAccounts()) {
      if (account.tenantId == TENANTID) {
        Auth.setActiveAccount(account);
        break;
      }
    } 
  }

  if (!Auth.getActiveAccount()) {
    return;
  }

  return await Auth.acquireTokenSilent(REQUEST);
};

const logoutRedirect = () => {
  Auth.logoutRedirect();
};

export { REQUEST, Auth, loginRedirect, getTokens, logoutRedirect };
