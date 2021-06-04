import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupStep0Component } from "./signup/signup-step-0/signup-step-0.component";
import { SignupStep1Component } from "./signup/signup-step-1/signup-step-1.component";
import { SignupStep2Component } from "./signup/signup-step-2/signup-step-2.component";
import { SignupStep10Component } from "./signup/signup-step-10/signup-step-10.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { EditAccountComponent } from "./edit-account/edit-account.component";
import { MyTrucksComponent } from "./my-trucks/my-trucks.component";

@NgModule({
  declarations: [LoginComponent, SignupStep0Component, SignupStep1Component, SignupStep2Component, SignupStep10Component, EditAccountComponent, MyTrucksComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule, SharedModule, ReactiveFormsModule, BsDatepickerModule]
})
export class AuthModule {}
