import { Component, OnInit, OnDestroy} from "@angular/core";
import { NgForm,FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./signup-step-0.component.html",
  styleUrls: ["./signup-step-0.component.css"]
})
export class SignupStep0Component implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  verifyEmailSent = false;
  submitted = false;
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });
  inviteCode = '';

  constructor(private fb:FormBuilder, public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.activatedRoute.queryParams.subscribe(params => {
      this.inviteCode = params['inviteCode'];
      if(this.inviteCode == undefined) {
        this.inviteCode = '';
      }
    });
    console.log(this.inviteCode);
  }

  get f() {
    return this.signupForm.controls;
  }

  onSignup() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.signupForm.value.email, this.signupForm.value.password, 1, this.inviteCode);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
