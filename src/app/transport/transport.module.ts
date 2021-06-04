import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TransportCreateComponent } from "./transport-create/transport-create.component";
import { AngularMaterialModule } from "../angular-material.module";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TransportListComponent } from "./cargo-list/transport-list.component";


@NgModule({
  declarations: [TransportCreateComponent, TransportListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TransportModule {}
