import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, filter, tap } from 'rxjs/operators'

import { ProfileService } from "./profile.service";

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isProfileCreated = this.profileService.getIsProfileCompleted();
    return isProfileCreated.pipe(
        tap(isProfileCreated => {
            if(!isProfileCreated) {
                this.router.navigate(['/']);
            }
        })
    );
  }
}
