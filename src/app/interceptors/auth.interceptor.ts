import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Token } from '../models/token';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

 // TODO handle if token is null
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Auth interceptor");
  
  const localStorage = inject(LocalStorageService);

  let identifier: string = environment.adb2cConfig.clientId;
  let token = localStorage.getItem<Token | null>('msal.token.keys.' + identifier);


  if (token != null && token.accessToken.length > 0) {

    //Clone the request to add the authentication header.
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token.accessToken}`)
    });
    console.log(newReq);
  }
  return next(req);
};
