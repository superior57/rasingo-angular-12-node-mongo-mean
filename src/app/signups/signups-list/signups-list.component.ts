import { Component, OnInit, OnDestroy } from "@angular/core";
import { SignupsService } from "../../signups/signups.service";
import { AuthService } from "../../auth/auth.service";
import { CargoSignup } from "../signups.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cargo-list",
  templateUrl: "./signups-list.component.html",
  styleUrls: ["./signups-list.component.css"]
})

export class SignUpsListComponent {
  isLoading = false;
  signups: CargoSignup[] = [];
  private signupsSub: Subscription;

  constructor(
    public signupsService: SignupsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.signupsService.getSignupsByUserId(this.authService.getUserId());
    this.signupsSub = this.signupsService
      .getSignupUpdateListener()
      .subscribe((signupData: { signups: CargoSignup[]; }) => {
        this.isLoading = false;
        this.signups = signupData.signups;
        console.log(this.signups);
      });
  }
}
