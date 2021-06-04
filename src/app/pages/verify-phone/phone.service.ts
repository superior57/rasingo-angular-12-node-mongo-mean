import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { PhoneDataVerify } from "../verify-phone/phone-data-verify.model";
import { PhoneData } from "../verify-phone/phone-data.model";
import { environment } from "../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class PhoneService {
  constructor(private http: HttpClient, public authService: AuthService, private router: Router) {}

  sendPC() {
    const PhoneData: PhoneData = {};
    this.http.post(BACKEND_URL + "sendPhoneCode/", PhoneData).subscribe(() => {
      this.router.navigate(["/verifyPhone"]);
    });
  }

  verifyPhone(phoneCode: string) {
    const PhoneDataVerify: PhoneDataVerify = {
      phoneCode: phoneCode
    };
    this.http.post(BACKEND_URL + "verifyPhoneCode/", PhoneDataVerify).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }
}
