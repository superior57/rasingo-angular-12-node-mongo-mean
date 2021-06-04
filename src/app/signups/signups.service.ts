import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { CargoSignup } from "../signups/signups.model";

const BACKEND_URL = environment.apiUrl + "/signups/";

@Injectable({ providedIn: "root" })
export class SignupsService {
  private signups: CargoSignup[] = [];
  private signupsUpdated = new Subject<{ signups: CargoSignup[]; }>();

  constructor(private http: HttpClient) {}

  getSignupUpdateListener() {
    return this.signupsUpdated.asObservable();
  }

  getSignupsByUserId(userId: string) {
    this.http
      .get<{ message: string; signups: any; }>(
        BACKEND_URL + "getSignupsByUserId/" + userId
      )
      .pipe(
        map(signupData => {
          return {
            signups: signupData.signups.map(signup => {
              return {
                userId: signup.userId,
                cargoId: signup.cargoId,
                truckId: signup.truckId,
                approved: signup.approved,
                finished: signup.finished,
                truck: signup.truck,
                cargo: signup.cargo
              };
            })
          };
        })
      )
      .subscribe(transformedSigupData => {
        this.signups = transformedSigupData.signups;
        this.signupsUpdated.next({
          signups: [...this.signups]
        });
      });
  }
}
