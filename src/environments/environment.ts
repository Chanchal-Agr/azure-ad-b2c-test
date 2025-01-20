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
    clientId: '770bf9e9-05de-44e9-b38f-ce261b4c2e0e',
    readScopeUrl: 'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/read',
    writeScopeUrl: 'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/write',
    scopeUrls:[
      'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/write',
      'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/read'
    ],
    apiEndpointUrl: serverUrl
  },
  cacheTimeInMinutes: 30,
};
