import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ParamMap, Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent {

  isLoading = false;
  submitted = false;
  fPasswordForm: FormGroup;
  private authStatusSub: Subscription;
  passwordVerificationCode = '';

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.fPasswordForm = new FormGroup({
      newPassword: new FormControl(null, {
        validators: [Validators.required]
      }),
      confirmNewPassword: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.passwordVerificationCode = params['passwordVerificationCode'];
    });
  }

  onSaveFPassword() {
    this.submitted = true;
    if(this.fPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.changeForgottenPassword(this.fPasswordForm.value.newPassword, this.passwordVerificationCode)
  }

  get f() {
    return this.fPasswordForm.controls;
  }
}
