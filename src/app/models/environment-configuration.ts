export interface EnvironmentConfiguration {
    env_name: string;
    //production: boolean;
    baseURL: string;
    // apiEndpoints: {
    //     userProfile: string;      
    // },
    adb2cConfig: {
        clientId: string;
        readScopeUrl: string;
        scopeUrls:string[];
        writeScopeUrl: string;
        apiEndpointUrl: string;
       
    };
    b2cPolicies:{
        names: {
          signUpSignIn: string;
        };
        authorities: {
          signUpSignIn: {
            authority: string;
          };
         
        };
        authorityDomain: string;
    };
    cacheTimeInMinutes: number;
}

