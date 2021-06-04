import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupStep0Component } from "./signup/signup-step-0/signup-step-0.component";
import { SignupStep1Component } from "./signup/signup-step-1/signup-step-1.component";
import { SignupStep2Component } from "./signup/signup-step-2/signup-step-2.component";
import { SignupStep10Component } from "./signup/signup-step-10/signup-step-10.component";
import { SignupStep1Guard } from "./signup-step-1.guard";
import { SignupStep2Guard } from "./signup-step-2.guard";
import { EditAccountComponent } from "./edit-account/edit-account.component";
import { AuthGuard } from "../auth/auth.guard";
import { EmailGuard } from "../auth/email.guard";
import { MyTrucksComponent } from "./my-trucks/my-trucks.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signupStep0", component: SignupStep0Component },
  { path: "signupStep1", component: SignupStep1Component, canActivate: [SignupStep1Guard] },
  { path: "signupStep2", component: SignupStep2Component, canActivate: [SignupStep2Guard] },
  { path: "signupStep10", component: SignupStep10Component },
  { path: "editAccount", component: EditAccountComponent, canActivate: [AuthGuard, EmailGuard]},
  { path: "myTrucks", component: MyTrucksComponent, canActivate: [AuthGuard, EmailGuard] },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [SignupStep1Guard, SignupStep2Guard, AuthGuard, EmailGuard]
})
export class AuthRoutingModule {}
