import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Docs } from "./docs.model";
import { Truck } from "../cargo/truck.model";
import AWN from "awesome-notifications";


const BACKEND_URL = environment.apiUrl + "/user/";
const BACKEND_URL_2 = environment.apiUrl + "/trucks/"

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;
  private email = '';
  private stepsCompleted = 'guest';
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private stepStatusListener = new Subject<string>();
  private adminStatusListener = new Subject<boolean>();
  trucksData: Truck[] = [];
  private trucksUpdated = new Subject<{ trucks: Truck[] }>();
  private trucks: Truck[] = [];
  notifier = new AWN();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getStepsCompleted() {
    return this.stepsCompleted;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getStepStatusListener() {
    return this.stepStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  createUser(email: string, password: string, registrationStep: number, inviteCode: string) {
    const AuthDataStep0 = {
      email: email,
      password: password,
      registrationStep: registrationStep,
      inviteCode: inviteCode
    };
    this.http.post(BACKEND_URL + "/signup", AuthDataStep0).subscribe(
      () => {
        this.router.navigate(["/confirmEmailSent"], {state: {email: AuthDataStep0.email}});
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  createUserStep1(companyName: string, taxNo: string, dialCode:string, telephone: string, address: string, city: string, country: string, postalCode: string, userType: string, registrationStep: number, trucks: Array<any>, docs: Array<any>) {
    const AuthDataStep1 = {
      companyName: companyName,
      taxNo: taxNo,
      dialCode: dialCode,
      telephone: telephone,
      address: address,
      city: city,
      country: country,
      postalCode: postalCode,
      userType: userType,
      registrationStep: registrationStep,
      trucks: trucks
    };
    this.http.put(BACKEND_URL + "signupStep1/", AuthDataStep1).subscribe(response => {
      this.getTrucksByUserId(this.getUserId()).subscribe(result => {
        this.trucksData = result.trucks;
        for(var i = 0; i < this.trucksData.length; i++) {
          this.addTruckDocs(docs[i][0], docs[i][1], docs[i][2], this.trucksData[i]._id);
        }
        this.router.navigate(["auth/signupStep2"]);
      });
    });
  }

  addNewTrucks(newTrucks: Array<any>, docs: Array<any>) {
    const newTruckData = {
      trucks: newTrucks
    };
    this.http.post(BACKEND_URL_2 + "addNewTrucks/", newTruckData).subscribe(response => {
      this.getTrucksByUserId(this.getUserId()).subscribe(result => {
        this.trucksData = result.trucks;
        for(var i = 0; i < newTrucks.length; i++) {
          this.addTruckDocs(docs[i][0], docs[i][1], docs[i][2], this.trucksData[i + this.trucksData.length - newTrucks.length]._id);
        }
        this.getMyTrucks();
      });
    });
  }

  createUserStep2(registrationStep: number) {
    const AuthDataStep2 = {
      registrationStep: registrationStep
    };
    this.http.put(BACKEND_URL + "signupStep2/", AuthDataStep2).subscribe(() => {
      this.stepStatusListener.next('inactive');
      this.router.navigate(["/createProfile"]);
    });
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http
      .post<{ token: string; userId: string; }>(
        BACKEND_URL + "/login",
        loginData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.saveAuthData(token, this.userId);
            this.getUser(this.userId).subscribe(result => {
              const step = result.registrationStep;
              const isEmailVerified = result.isEmailVerified;
              if(!isEmailVerified) {
                this.stepStatusListener.next('active');
                this.router.navigate(["auth/signupStep10"]);
              }
              else if(step == 0) {
                this.router.navigate(["auth/signupStep0"]);
              }
              else if(step == 1){
                this.stepStatusListener.next('active');
                this.router.navigate(["auth/signupStep1"]);
              }
              else if(step == 2) {
                this.stepStatusListener.next('active');
                this.router.navigate(["auth/signupStep2"]);
              }
              if(step == 3) {
                this.getUser(this.getUserId()).subscribe(result => {
                  if(result.isAdmin) {
                    this.isAdmin = true;
                    this.adminStatusListener.next(true);
                    this.router.navigate(["admin/dashboard"]);
                  }
                  else {
                    this.router.navigate(["/"]);
                  }
                });
              }
            });
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  public getUser(userId: string) {
    return this.http.get<{
      _id: string;
      registrationStep: number;
      email: string;
      userType: string;
      isAdmin: boolean;
      isEmailVerified: boolean;
      isProfileCompleted: boolean;
      isTelephoneVerified: boolean;
      dialCode: string;
      telephone: string;
      companyName: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
    }>(BACKEND_URL+"getUserData/" + userId);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.authStatusListener.next(true);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.stepStatusListener.next('guest');
    this.adminStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      return;
    }
    return {
      token: token,
      userId: userId
    };
  }

  addDocs(file: File, docType: string) {
    const docsData = new FormData();
    docsData.append("file", file);
    docsData.append("docType", docType);
    this.http
      .post<{ message: string; docs: Docs }>(
        BACKEND_URL+ "docs/",
        docsData
      )
      .subscribe(responseData => {});
  }

  getTrucksByUserId(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL_2 + "getTrucksByUserId/" + userId);
  }

  addTruckDocs(TLIC: File, LIC: File, CMRLIC: File, truckId: string) {
    const docsData = new FormData();
    docsData.append("TLIC", TLIC);
    docsData.append("LIC", LIC);
    docsData.append("CMRLIC", CMRLIC);
    docsData.append("truckId", truckId);
    this.http
      .put(
        BACKEND_URL+ "truckDocs/",
        docsData
      )
      .subscribe(responseData => {});
  }

  getIsAdmin(): Observable<boolean> {
    return this.getUser(this.getUserId()).pipe(
      map(user => user.isAdmin)
    );
  }

  resendAC() {
    const AuthDataStep10 = {};
    if(this.getIsAuth()) {
      this.getUser(this.getUserId()).subscribe(result => {
        this.email = result.email;
      });
      this.http.post(BACKEND_URL + "resendAC/", AuthDataStep10).subscribe(
        () => {
          console.log("tu sam")
          this.router.navigate(["/confirmEmailSent"], {state: {email: this.email}});
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
    }
  }

  getIsStep1Valid(): Observable<boolean>{
    return this.getUser(this.getUserId()).pipe(
      map(user => user.registrationStep == 1)
    );
  }

  getIsStep2Valid(): Observable<boolean>{
    return this.getUser(this.getUserId()).pipe(
      map(user => user.registrationStep == 2)
    );
  }

  getIsEmailVerified(): Observable<boolean>{
    return this.getUser(this.getUserId()).pipe(
      map(user => user.isEmailVerified)
    );
  }

  editPassword(oldPassword: string, newPassword: string) {
    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    this.http.put(BACKEND_URL + "editPassword/", passwordData).subscribe(() => {
      this.notifier.success('Password changed succesfully');
      this.logout();
    });
  }

  sendForgotCode(email: string) {
    const forgotData = {
      email: email
    };
    this.http.post(BACKEND_URL + "sendForgotCode/", forgotData).subscribe(() => {
      this.notifier.success('Please check your email');
      this.logout();
    });
  }

  changeForgottenPassword(newPassword: string, passwordVerificationCode: string) {
   const forgotData = {
     newPassword: newPassword,
     passwordVerificationCode: passwordVerificationCode
   }
   this.http.put(BACKEND_URL + "changeFPassword/", forgotData).subscribe(() => {
    this.notifier.success('Password changed succesfully');
    this.router.navigate(["/auth/login"]);
  });
  }

  getMyTrucks() {
    this.http
      .get<{ message: string; trucks: any; }>(
        BACKEND_URL_2 + "getTrucksByUserId/" + this.getUserId()
      )
      .pipe(
        map(truckData => {
          return {
            trucks: truckData.trucks.map(truck => {
              return {
                _id: truck._id,
                truckModel: truck.truckModel,
                truckType: truck.truckType,
                year: truck.year,
                regNumber: truck.regNumber,
                regDate: truck.regDate,
                maxWeight: truck.maxWeight,
                width: truck.width,
                height: truck.height,
                tlength: truck.tlength,
                euroNorm: truck.euroNorm,
                approved: truck.approved,
                hydraulicRamp: truck.hydraulicRamp,
                crane: truck.crane,
                winches: truck.winches,
                adjustableRoof: truck.adjustableRoof,
                movableFloor: truck.movableFloor,
                movableTarpaulin: truck.movableTarpaulin,
                rotatingSignalLight: truck.rotatingSignalLight,
                containerLifter: truck.containerLifter
              };
            }),
          };
        })
      )
      .subscribe(transformedTruckData => {
        this.trucks = transformedTruckData.trucks;
        this.trucksUpdated.next({
          trucks: [...this.trucks]
        });
      });

  }
  getTruckUpdateListener() {
    return this.trucksUpdated.asObservable();
  }

  deleteTruck(truckId: string) {
    return this.http.delete(BACKEND_URL_2 + "/deleteTruck/" + truckId);
  }
}
