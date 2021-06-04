import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./send-code.component.html",
  styleUrls: ["./send-code.component.css"]
})
export class SendPasswordCodeComponent {

  isLoading = false;
  submitted = false;
  forgotForm: FormGroup;
  private authStatusSub: Subscription;

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.forgotForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      })
    });
  }

  onForgot() {
    this.submitted = true;
    if(this.forgotForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.sendForgotCode(this.forgotForm.value.email)
  }
}
