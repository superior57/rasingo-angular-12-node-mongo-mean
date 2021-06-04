import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { AdminDashboardComponent } from "../admin/dashboard/dashboard.component";
import { AdminUsersListComponent } from "../admin/users/user-list/users-list.component";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUsersListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class AdminModule {}
