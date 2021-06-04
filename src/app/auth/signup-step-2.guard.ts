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
export class SignupStep2Guard implements CanActivate {
  private isStep1Valid = false;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isAdmin = this.authService.getIsStep2Valid();
    return isAdmin.pipe(
        tap(isAdmin => {
            if(!isAdmin) {
                this.router.navigate(['/']);
            }
        })
    );
  }
}
