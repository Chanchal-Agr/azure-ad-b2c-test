import { EnvironmentConfiguration } from "../app/models/environment-configuration";

const serverUrl='https://localhost:44351/api';


// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile:'user-profiles'
  },
  adb2cConfig: {
    clientId: 'b57c945b-1440-4489-884c-b4cf833f5a36',
    readScopeUrl: 'https://hbcradiomatictest.onmicrosoft.com/demoapi/read',
    writeScopeUrl: 'https://hbcradiomatictest.onmicrosoft.com/demoapi/write',
    scopeUrls:[
      'https://hbcradiomatictest.onmicrosoft.com/demoapi/write',
      'https://hbcradiomatictest.onmicrosoft.com/demoapi/read'
    ],
    apiEndpointUrl: serverUrl
  },
  cacheTimeInMinutes: 30,
};
