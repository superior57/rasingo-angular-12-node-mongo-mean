import { Component, OnInit, OnDestroy} from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { ProfileService } from "../profile.service";
import { ProfileFull } from "../profile-full.model";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";
import { Cargo } from "../../cargo/cargo.model";
import { Truck } from "../../cargo/truck.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Review } from "../review.model";

@Component({
  selector: "app-profile-show",
  templateUrl: "./show-profile.component.html",
  styleUrls: ["./show-profile.component.css"]
})

export class ShowProfileComponent {
  isLoading = false;
  profile: ProfileFull[] = [];
  userId = '';
  firms = false;
  private cargosSub: Subscription;
  cargos: Cargo[] = [];
  areTrucks = false;
  drivers = false;
  both = false;
  trucks: Truck[] = [];
  cargoSignupForm: FormGroup;
  reviewForm: FormGroup;
  public showReviewForm:boolean = false;
  submitted = false;
  stars = new FormControl('', Validators.required);
  currentRate = 0;
  reviews: Review[] = [];

  constructor(
    public profileService: ProfileService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    if(this.authService.getIsAuth()) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.userId = params['userId'];
      });
      this.profileService.getPublicUserProfile(this.userId).subscribe((result) => {
        this.profile = result.profile
      });
      this.profileService.getCargos(this.userId).subscribe((result) => {
        this.cargos = result.cargos
      });
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
      this.cargoSignupForm = new FormGroup({
        truckId: new FormControl('', Validators.required)
      });
      this.reviewForm = new FormGroup({
        review: new FormControl('', Validators.required),
        stars: new FormControl('', Validators.required)
      });
      this.profileService.getReviews(this.userId).subscribe((result: any) => {
        this.reviews = result;
        console.log(this.reviews);
      });
    }
  }

  onSignupForCargo(cargoId: string) {
    this.isLoading = true;
    this.profileService.signupForCargo(
      cargoId,
      this.cargoSignupForm.value.truckId
    )
  }

  toDateFormat(param){
    return new Date(param).toString();
  }

  toggleReview() {
    this.showReviewForm = !this.showReviewForm;
  }

  onAddReview(childId: string) {
    this.submitted = true;
    if (this.reviewForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.profileService.addReview(this.reviewForm.value.review, this.reviewForm.value.stars, childId);
  }
}
