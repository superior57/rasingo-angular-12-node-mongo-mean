import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, Subject } from 'rxjs';
import { UserA } from "./user-approve.model";
import { TruckA } from "./truck-approve.model";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";


const BACKEND_URL = environment.apiUrl + "/user";
const BACKEND_URL_2 = environment.apiUrl + "/trucks";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACKEND_URL + "/getUsers" + queryParams
      )
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return {
                id: user._id,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                approved: user.approved,
                companyName: user.companyName,
                oib: user.oib,
                telephone: user.telephone,
                address: user.address,
                city: user.city,
                country: user.country,
                postalCode: user.postalCode,
                userType: user.userType,
                user_docs: user.user_docs,
                user_trucks: user.user_trucks
              };
            }),
            maxUsers: userData.maxUsers
          };
        })
      )
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers
        });
      });
  }

  approve(userId: string) {
    const UserData: UserA = {
      approved: true
    };
    return this.http.put(BACKEND_URL + "/approve/" + userId, UserData);
  }

  approveTruck(truckId: string) {
    const TruckData: TruckA = {
      approved: true
    };
    return this.http.put(BACKEND_URL_2 + "/approve/" + truckId, TruckData);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  deleteTruck(truckId: string) {
    return this.http.delete(BACKEND_URL_2 + "/deleteTruck/" + truckId);
  }
}
