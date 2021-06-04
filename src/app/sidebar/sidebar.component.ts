import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userIsAdmin = false;
  private authListenerSubs: Subscription;
  step = 0;
  email = "";
  id = '';
  private stepListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  stepsCompleted = 'inactive';
  constructor(private authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['English', 'Deutsch', 'Hrvatski', 'Hungarian', 'Polski']);
    translate.setDefaultLang('English');
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.authService.getIsAuth()) {
      this.authService.getUser(this.authService.getUserId()).subscribe(result => {
        this.userIsAdmin = result.isAdmin;
      });
    }
    if(this.userIsAuthenticated) {
      this.authService.getUser(this.authService.getUserId()).subscribe(result => {
        this.email = result.email;
        this.id = result._id;
        if(!result.isEmailVerified) {
          this.step = 10;
          this.stepsCompleted = 'active';
        }
        else {
          this.step = result.registrationStep;
          if(this.step == 1 || this.step == 2) {
            this.stepsCompleted = 'active';
          }
        }
      });
    }
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.authService.getUser(this.authService.getUserId()).subscribe(result => {
          this.email = result.email;
          if(result.isEmailVerified) {
            this.step = result.registrationStep;
          }
          else {
            this.step = 10;
          }
        });
        this.userIsAuthenticated = isAuthenticated;
    });
    this.stepListenerSubs = this.authService.getStepStatusListener()
      .subscribe(
        stepStatus => {
          this.stepsCompleted = stepStatus;
          this.authService.getUser(this.authService.getUserId()).subscribe(result => {
            this.step = result.registrationStep;
          });
    });
    this.adminListenerSubs = this.authService.getAdminStatusListener()
      .subscribe(
        adminStatus => {
          this.userIsAdmin = adminStatus;
        }
      )
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
