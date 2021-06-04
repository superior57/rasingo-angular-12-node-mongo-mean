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
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isAdmin = this.authService.getIsAdmin();
    return isAdmin.pipe(
        tap(isAdmin => {
            if(!isAdmin) {
                this.router.navigate(['auth/login']);
            }
        })
    );
  }
}
