import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Profile } from "./profile.model";
import { AuthService } from "../auth/auth.service";
import { Cargo } from "../cargo/cargo.model";
import { CargoSignup } from "../signups/signups.model";
import { Info } from "./info.model";
import { Review } from "./review.model";

const BACKEND_URL = environment.apiUrl + "/profile/";
const BACKEND_URL_2 = environment.apiUrl + "/cargos/";
const BACKEND_URL_3 = environment.apiUrl + "/trucks/";
const BACKEND_URL_4 = environment.apiUrl + "/signups/";

@Injectable({ providedIn: "root" })
export class ProfileService {

  private cargos: Cargo[] = [];

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) {}

  getCargos(userId: string):Observable<any> {
    return this.http.get(BACKEND_URL_2 + "getCargosForProfile/" + userId);
  }

  getUserProfile():Observable<any>  {
    return this.http.get(BACKEND_URL + "getUserProfile");
  }

  getPublicUserProfile(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL + "getPublicUserProfile/" + userId);
  }

  addProfile(
    about: string,
    web: string,
    employees: number,
    year: number,
    workingHours: string
  ) {
    let profileData: Profile
    profileData = {
      about: about,
      web: web,
      employees: employees,
      year: year,
      workingHours: workingHours,
    };
    this.http
      .post(
        BACKEND_URL + "addProfile",
        profileData
      ).subscribe(
        () => {
          this.router.navigate(["/showMyProfile"]);
        }
      );
  }

  addCoverPhoto(file: File) {
    const imageData = new FormData();
    imageData.append("file", file);
    return this.http
      .put(
        BACKEND_URL+"addCoverPhoto/",
        imageData
      )
  }

  addProfilePhoto(file: File) {
    const imageData = new FormData();
    imageData.append("file", file);
    return this.http
      .put(
        BACKEND_URL+"addProfilePhoto/",
        imageData
      )
  }

  getIsProfileCompleted(): Observable<boolean>{
    return this.authService.getUser(this.authService.getUserId()).pipe(
      map(profile => profile.isProfileCompleted == false)
    );
  }

  getIsProfileIncompleted(): Observable<boolean>{
    return this.authService.getUser(this.authService.getUserId()).pipe(
      map(profile => profile.isProfileCompleted == true)
    );
  }

  getTrucksByUserId(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL_3 + "getTrucksByUserId/" + userId);
  }

  signupForCargo(cargoId: string, truckId: string) {
    const signupForCargo: CargoSignup = {
      cargoId: cargoId,
      truckId: truckId,
      approved: false,
      finished: false
    }
    this.http
      .post(BACKEND_URL_4 + "addSignup/" , signupForCargo)
      .subscribe(response => {
        window.location.reload();
      });
  }

  updateInfo(about: string, web: string, employees: number, year: number, workingHours: string) {
    const info: Info = {
      about: about,
      web: web,
      employees: employees,
      year: year,
      workingHours: workingHours
    }
    return this.http.put(BACKEND_URL + "updateInfo/" , info);
  }

  getInfoData() {
    return this.http.get<{
      _id: string;
      about: string,
      web: string,
      employees: number,
      year: number,
      workingHours: string
    }>(BACKEND_URL+ "getProfileInfoById/");
  }

  addReview(review: string, stars: number, childId: string) {
    const reviewData: Review = {
      review: review,
      stars: stars,
      childId: childId
    }
    this.http
      .post(BACKEND_URL + "addReview/" , reviewData)
      .subscribe(response => {
        window.location.reload();
      });
  }

  getReviews(childId: string) {
    return this.http.get(BACKEND_URL + "getReviewsByChildId/" + childId);
  }
}
