import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { environment } from "../../../environments/environment";
import { Invite } from "./invite.model"

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class InviteService {
  constructor(private http: HttpClient, public authService: AuthService, private router: Router) {}

  inviteUser(email: string) {
    const inviteUser: Invite = {
      email: email
    };
    this.http.post(BACKEND_URL + "invite/", inviteUser).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }
}
