import { Component, OnInit, OnDestroy} from "@angular/core";
import { NgForm,FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./signup-step-10.component.html",
  styleUrls: ["./signup-step-10.component.css"]
})
export class SignupStep10Component implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  verifyEmailSent = false;
  submitted = false;
  resendForm = new FormGroup({});

  constructor(private fb:FormBuilder, public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  get f() {
    return this.resendForm.controls;
  }

  onResend() {
    this.submitted = true;
    if (this.resendForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resendAC();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
