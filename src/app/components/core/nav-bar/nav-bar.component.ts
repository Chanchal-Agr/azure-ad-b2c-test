import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { Token } from '../../../models/token';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  public loginDisplay:boolean = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.loginDisplay = loggedIn;
    });
  }
  public loginRedirect() {
    this.loginService.loginRedirect()
  }

  public logout() {
    this.loginService.logout()
    }

}

 









