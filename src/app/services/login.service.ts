import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, AuthenticationResult, InteractionStatus, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

import { Claim } from '../models/claim';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createClaimsTable } from '../claim-utils';



@Injectable({ providedIn: 'root' })
export class LoginService {
    // Use BehaviorSubject to provide an observable for claims availability
    private claimsSubject = new BehaviorSubject<Claim[]>([]);
    claims$ = this.claimsSubject.asObservable();

    loginDisplay = false;
    displayedColumns: string[] = ['claim', 'value', 'description'];

    constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private http: HttpClient) {
        this.getClaims(undefined);
        this.msalBroadcastService.msalSubject$
            .pipe(
                filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
            )
            .subscribe((result: EventMessage) => {
                const payload = result.payload as AuthenticationResult;

                this.authService.instance.setActiveAccount(payload.account);
            });

        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None)
            )
            .subscribe(() => {
                this.setLoginDisplay();
                const claims = this.authService.instance.getActiveAccount()?.idTokenClaims;
                this.getClaims(claims);
            });
    }


    setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    }

    getClaims(claims: any) {

        if (claims) {
            const claimsTable = createClaimsTable(claims);
            this.claimsSubject.next([...claimsTable]);
        } else {
            this.claimsSubject.next([]); // No claims available
        }
    }

    async callApi(apiEndpoint: string): Promise<any> {
        try {
          const accounts = this.authService.instance.getAllAccounts();
          if (accounts.length > 0) {
            const tokenRequest = {
              scopes: [ 'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/read',
                'https://pageupsoftadb2c.onmicrosoft.com/dev/expensetracker/api/write'], // Replace with your API's required scopes
              account: accounts[0]
            };
           

            const tokenResponse = await firstValueFrom(
              this.authService.acquireTokenSilent(tokenRequest)
            );
            const accessToken = tokenResponse.accessToken;
            console.log("hello toke");
            
            console.log(accessToken);
            
            const headers = new HttpHeaders({
              Authorization: `Bearer ${accessToken}`
            });
   
            return this.http.get(apiEndpoint, { headers }).toPromise();
          } else {
            throw new Error("No user is signed in.");
          }
        } catch (error) {
          console.error("Error acquiring token or calling API:", error);
          // Handle token acquisition errors or API call errors (e.g., redirect to login)
          throw error; // Re-throw the error for handling in the calling component
        }
}}
