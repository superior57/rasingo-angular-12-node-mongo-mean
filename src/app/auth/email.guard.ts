import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, filter, tap } from 'rxjs/operators'

import { AuthService } from "./auth.service";

@Injectable()
export class EmailGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isEmailVerified = this.authService.getIsEmailVerified();
    return isEmailVerified.pipe(
        tap(isEmailVerified => {
            if(!isEmailVerified) {
                this.router.navigate(['auth/signupStep10']);
            }
        })
    );
  }
}
