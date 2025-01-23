import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MsalService, MsalBroadcastService, MsalGuardConfiguration, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, AuthenticationResult, InteractionStatus, EventType, RedirectRequest } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Claim } from '../models/claim';
import { HttpClient, } from '@angular/common/http';
import { createClaimsTable } from '../claim-utils';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';
import { Token } from '../models/token';



@Injectable({ providedIn: 'root' })
export class LoginService {
  // Use BehaviorSubject to provide an observable for claims availability
  private claimsSubject = new BehaviorSubject<Claim[]>([]);
  public claims$ = this.claimsSubject.asObservable();

  //access modifier
  private loginDisplay: boolean = false;
  public displayedColumns: string[] = ['claim', 'value', 'description'];
  public logIn$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private localStorage: LocalStorageService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) {

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS
        )
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        console.log("Set active account");

        this.authService.instance.setActiveAccount(payload.account);
        this.setLoginDisplay();
      });


    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
      )
      .subscribe(() => {
        this.setLoginDisplay();
        const claims = this.authService.instance.getActiveAccount()?.idTokenClaims;
        this.getClaims(claims);
        console.log(claims);

      });
  }

  public loginRedirect() {
    console.log("Login method called.");
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect()
    }
  }

  public logout() {
    console.log("log out called");

    this.authService.logoutRedirect();

  }

  private setLoginDisplay() {

    let identifier: string = environment.adb2cConfig.clientId;
    let token = this.localStorage.getItem<Token | null>('msal.token.keys.' + identifier);

    this.loginDisplay = token != null && token.accessToken.length > 0;

    this.logIn$.next(this.loginDisplay);
  }

  private getClaims(claims: any) {
    console.log("getClaims method called.");

    if (claims) {
      console.log("Claims found.");

      const claimsTable = createClaimsTable(claims);
      this.claimsSubject.next([...claimsTable]);
    } else {
      this.claimsSubject.next([]); // No claims available
    }
  }

  public async callApi(apiEndpoint: string): Promise<any> {
    try {
      return this.http.get(`${environment.baseURL}${apiEndpoint}`).toPromise();
    }
    catch (error) {
      console.error("Error acquiring token or calling API:", error);
      throw error; // Re-throw the error for handling in the calling component
    }
  }


}



