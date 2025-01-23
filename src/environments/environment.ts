import { EnvironmentConfiguration } from "../app/models/environment-configuration";


const baseURL = 'https://localhost:44351/api/';
const hostDaenet = 'https://hbcradiomatictest.onmicrosoft.com/demoapi';
const hostPageup = 'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api';
const clientIdPageup = '770bf9e9-05de-44e9-b38f-ce261b4c2e0e';
const clientIdDaenet = 'b57c945b-1440-4489-884c-b4cf833f5a36';


const host = hostPageup;
const clientId = clientIdPageup;
const scopreUrls = [
  `${host}/write`,
  `${host}/read`
]



const b2cPoliciesPageup = {
  names: {
    signUpSignIn: 'B2C_1_pageuptest'
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://pageupsoftadb2c.b2clogin.com/pageupsoftadb2c.onmicrosoft.com/B2C_1_pageuptest',
    }
  },
  authorityDomain: 'pageupsoftadb2c.b2clogin.com',
};

const b2cPoliciesDaenet = {
  names: {
    signUpSignIn: 'B2C_1_signupsignin1'
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://hbcradiomatictest.b2clogin.com/hbcradiomatictest.onmicrosoft.com/B2C_1_signupsignin1',
    }
  },
  authorityDomain: 'hbcradiomatictest.b2clogin.com',
};


// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  //production: true,
  baseURL: baseURL,
  // apiEndpoints: {
  //   userProfile:'user-profiles'
  // },
  adb2cConfig: {
    clientId: clientId,
    readScopeUrl: `${host}/read`,
    writeScopeUrl: `${host}/write`,
    scopeUrls: scopreUrls,
    apiEndpointUrl: baseURL

  },
  b2cPolicies: b2cPoliciesPageup,
  cacheTimeInMinutes: 30,
};
