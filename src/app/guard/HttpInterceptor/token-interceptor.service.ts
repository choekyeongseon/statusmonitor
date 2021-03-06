import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';
import { Buffer } from 'buffer';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor{
  
  _cookie:string;

  constructor(
    private injector: Injector
    ) { 
      
    }
  
  intercept(req: import("@angular/common/http").HttpRequest<any>, 
  next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    let authService = this.injector.get(AuthServiceService);
    let auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${auth}`
      }
    });
    return next.handle(tokenizedReq);
  }
}
