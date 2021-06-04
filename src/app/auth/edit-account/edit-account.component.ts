import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators, Form } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./edit-account.component.html",
  styleUrls: ["./edit-account.component.css"]
})
export class EditAccountComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  submitted = false;
  passwordForm: FormGroup;
  emailForm: FormGroup;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
    });
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required)
    });
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required])
    });
  }

  onSavePassword() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.editPassword(
      this.passwordForm.value.oldPassword,
      this.passwordForm.value.newPassword
    );

  }

  get f() {
    return this.passwordForm.controls;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
