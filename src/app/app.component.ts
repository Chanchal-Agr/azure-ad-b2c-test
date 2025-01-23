import { Component } from '@angular/core';
import { NavBarComponent } from "./components/core/nav-bar/nav-bar.component";
import { MsalService } from '@azure/msal-angular';
import { Claim } from './models/claim';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { APIRoutes } from './constants/APIRoutes.constants';

@Component({
  selector: 'app-root',
  imports: [NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public title = 'azure-ad-b2c-test';
  //  isIframe = false;
  public claims: Claim[] = [];

  constructor(
    private authService: MsalService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    //  this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    //this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window

    //To subscribe for claims
    this.loginService.claims$.subscribe((c: Claim[]) => {
      this.claims = c;
    });

  }

  public callApi() {
    this.loginService.callApi(`${APIRoutes.getUserById}`)
      .then((data: any) => {
        console.log('API Response from UserService:', data);
      })
      .catch((error: any) => {
        console.error('Error calling API:', error);
      });
  }

  
}
