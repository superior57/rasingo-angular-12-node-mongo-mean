import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { SharedModule } from "../shared.module";
import { ShowMyProfileComponent } from "./show-my-profile/show-my-profile.component";
import { ProfileCreateComponent } from "./profile-create/profile-create.component";
import { ShowProfileComponent } from "./show-profile/show-profile.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ImageCropperModule } from "ngx-image-cropper";
import { CoverCreateComponent } from "./cover-create/cover-create.component";
import { PhotoCreateComponent } from "./photo-create/photo-create.component";

@NgModule({
  declarations: [ShowMyProfileComponent, ProfileCreateComponent, ShowProfileComponent, CoverCreateComponent, PhotoCreateComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, SharedModule, ReactiveFormsModule, RouterModule, NgbModule, ImageCropperModule]
})
export class ProfileModule {}
