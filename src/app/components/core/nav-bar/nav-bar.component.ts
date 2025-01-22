import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { Token } from '../../../models/token';


@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  public loginDisplay = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private localStorage: LocalStorageService
  ) {

  }

  ngOnInit(): void {
    this.isUserLogin();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED ||
            msg.eventType === EventType.LOGIN_SUCCESS // Add this event type
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.isUserLogin();
        }
      });
  }

  public loginRedirect() {
    console.log("Login method called.");
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest).subscribe(() => {
        this.isUserLogin(); // Update loginDisplay after successful login
      });
    } else {
      this.authService.loginRedirect().subscribe(() => {
        this.isUserLogin(); // Ensure loginDisplay is updated here too
      });
    }
  }


  public logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }


  isUserLogin() {
    let identifier: string = environment.adb2cConfig.clientId;
    let token = this.localStorage.getItem<Token | null>('msal.token.keys.'+ identifier);
    // this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.loginDisplay = token != null && token.accessToken.length > 0;
    console.log(`Login display-${!this.loginDisplay}`);
  }
}

 









