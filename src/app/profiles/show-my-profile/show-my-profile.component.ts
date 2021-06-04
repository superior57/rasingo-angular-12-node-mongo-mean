import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { ProfileService } from "../profile.service";
import { ProfileFull } from "../profile-full.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Info } from "../info.model";
import { Truck } from "../../cargo/truck.model";
import { Review } from "../review.model";
import { Cargo } from "../../cargo/cargo.model";
import AWN from "awesome-notifications";


@Component({
  selector: "app-profile-show",
  templateUrl: "./show-my-profile.component.html",
  styleUrls: ["./show-my-profile.component.css"]
})

export class ShowMyProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  profile: ProfileFull[] = [];
  isTelephoneVerified: boolean;
  public infoFormShow:boolean = false;
  infoForm: FormGroup;
  submitted = false;
  drivers = false;
  both = false;
  firms = false;
  areTrucks = false;
  private authStatusSub: Subscription;
  info: Info;
  trucks: Truck[] = [];
  reviews: Review[] = [];
  cargos: Cargo[] = [];
  cargoSignupForm: FormGroup;
  notifier = new AWN();

  constructor(
    public profileService: ProfileService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
    });
    if(this.authService.getIsAuth()) {
      this.profileService.getUserProfile().subscribe((result) => {
        this.profile = result.profile
      });
      this.authService.getUser(this.authService.getUserId()).subscribe(result => {
        this.isTelephoneVerified = result.isTelephoneVerified;
      })
    }
    this.infoForm = new FormGroup({
      about: new FormControl(),
      web: new FormControl(),
      employees: new FormControl(),
      year: new FormControl(),
      workingHours: new FormControl()
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
      this.profileService.getInfoData().subscribe(data => {
        this.isLoading = false;
        this.info = {
          about: data[0].about,
          web: data[0].web,
          employees: data[0].employees,
          year: data[0].year,
          workingHours: data[0].workingHours
        };
        this.infoForm.setValue({
          about: this.info.about,
          web: this.info.web,
          employees: this.info.employees,
          year: this.info.year,
          workingHours: this.info.workingHours
        });
      })
      this.authService.getUser(this.authService.getUserId()).subscribe(result => {
        if(result.userType == 'drivers' || result.userType == 'both') {
          this.areTrucks = true;
          this.drivers = true;
          this.both = true;
          this.profileService.getTrucksByUserId(this.authService.getUserId()).subscribe((result) => {
            this.trucks = result.trucks;
          });
        }
        else {
          this.firms = true;
        }
      });
      this.profileService.getReviews(this.authService.getUserId()).subscribe((result: any) => {
        this.reviews = result;
        console.log(this.reviews);
      });
      this.profileService.getCargos(this.authService.getUserId()).subscribe((result) => {
        this.cargos = result.cargos
      });
      this.cargoSignupForm = new FormGroup({
        truckId: new FormControl('', Validators.required)
      });
  }

  toggleInfo() {
    this.infoFormShow = !this.infoFormShow;
  }

  onChangeInfo() {
    this.submitted = true;
    if (this.infoForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.profileService.updateInfo(
      this.infoForm.value.about,
      this.infoForm.value.web,
      this.infoForm.value.employees,
      this.infoForm.value.year,
      this.infoForm.value.workingHours
    ).subscribe(()=> {
      this.profileService.getUserProfile().subscribe(result => {
        this.profile = result.profile
        this.notifier.success('Profile updated');
        this.isLoading = false;
        this.toggleInfo();
      });
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  toDateFormat(param){
    return new Date(param).toString();
  }
}
