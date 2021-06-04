import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CargoCreateComponent } from "./cargo-create/cargo-create.component";
import { CargoListComponent } from "./cargo-list/cargo-list.component";
import { CargoListFirmComponent } from "./cargo-list-firm/cargo-list-firm.component";
import { SignUpsListComponent } from "../signups/signups-list/signups-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CMRCreateComponent } from "./cmr/cmr-create/cmr-create.component";
import { ShowCMRComponent } from "./cmr/show-cmr/show-cmr.component";
import { MyCargoListComponent } from "./my-cargo-list/my-cargo-list.component";
import { SharedModule } from "../shared.module";
import { SidebarComponent } from "../sidebar/sidebar.component";


@NgModule({
  declarations: [CargoCreateComponent, CargoListComponent, SignUpsListComponent, CargoListFirmComponent, CMRCreateComponent, ShowCMRComponent, MyCargoListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class CargosModule {}
