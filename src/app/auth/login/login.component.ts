import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, NgForm, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  verifyMessage = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  submitted = false;

  constructor( public authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.verifyMessage = params['verifyMessage'];
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {

      }
    );
  }

  onLogin() {
    this.submitted = true;
    if(this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
