import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  public loginDisplay: boolean = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {

    this.loginService.logIn$.subscribe((loginDisplay: boolean) => {
      this.loginDisplay = loginDisplay;
    })

  }
  public loginRedirect() {
    this.loginService.loginRedirect()
  }

  public logout() {
    this.loginService.logout()
  }

}











