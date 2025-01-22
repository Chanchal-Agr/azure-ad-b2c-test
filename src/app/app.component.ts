import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/core/nav-bar/nav-bar.component";
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import { Claim } from './models/claim';
import { InteractionStatus } from '@azure/msal-browser';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'azure-ad-b2c-test';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  claims: Claim[] = [];

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    // this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter(
    //       (msg: EventMessage) =>
    //         msg.eventType === EventType.ACCOUNT_ADDED ||
    //         msg.eventType === EventType.ACCOUNT_REMOVED
    //     )
    //   )
    //   .subscribe((result: EventMessage) => {
    //     if (this.authService.instance.getAllAccounts().length === 0) {
    //       window.location.pathname = '/';
    //     } else {
    //       this.setLoginDisplay();
    //     }
    //   });

    //To subscribe for claims
    this.loginService.claims$.subscribe((c: Claim[]) => {
      this.claims = c;
    });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        // this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
  }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    console.log("checkAndSetActiveAccount method called");

    let activeAccount = this.authService.instance.getActiveAccount();
    console.log("Active account " + activeAccount);

    console.log("get all accounts " + this.authService.instance.getAllAccounts().length);


    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }


  callApi() {
    this.loginService.callApi("https://localhost:44351/api/Users/4")
      .then((data: any) => {
        console.log('API Response from UserService:', data);
      })
      .catch((error: any) => {
        console.error('Error calling API:', error);
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
