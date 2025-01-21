import { EnvironmentConfiguration } from "../app/models/environment-configuration";


const serverUrl='https://localhost:44351/api';
const hostDaenet = 'https://hbcradiomatictest.onmicrosoft.com/demoapi';
const hostPageup = 'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api';
export const host = hostPageup;
const clientIdPageup  = '770bf9e9-05de-44e9-b38f-ce261b4c2e0e';
const clientIdDaenet =  'b57c945b-1440-4489-884c-b4cf833f5a36';
const clientId =  clientIdPageup;
export const scopreUrls = [
  `${host}/write`,
  `${host}/read`
]


// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile:'user-profiles'
  },
  adb2cConfig: {
    clientId:clientId ,
    readScopeUrl: `${host}/read`,
    writeScopeUrl: `${host}/write`,
    scopeUrls:scopreUrls,
    apiEndpointUrl: 'https://localhost:44351/api'
  },
  cacheTimeInMinutes: 30,
};
