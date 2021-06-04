import { ProfileService } from "../profile.service";
import { Profile } from "../profile.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { mimeType } from "./mime-type.validator";
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: "app-post-create",
  templateUrl: "./profile-create.component.html",
  styleUrls: ["./profile-create.component.css"]
})
export class ProfileCreateComponent implements OnInit, OnDestroy {
  profile: Profile;
  isLoading = false;
  profileForm: FormGroup;
  private authStatusSub: Subscription;
  coverImageChangedEvent: any = '';
  coverCroppedImage: any = '';
  coverCropperStaticWidth: any = 1200;
  coverCropperStaticHeight: any = 400;
  profileImageChangedEvent: any = '';
  profileCroppedImage: any = '';
  profileCropperStaticWidth: any = 200;
  profileCropperStaticHeight: any = 200;
  coverFile: any = '';
  profileFile: any = '';

  constructor(
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.profileForm = new FormGroup({
      coverPhoto: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
      profilePhoto: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
      about: new FormControl(),
      web: new FormControl(),
      employees: new FormControl(),
      year: new FormControl(),
      workingHours: new FormControl()
    });
  }

  coverFileChangeEvent(event: any): void {
    this.coverImageChangedEvent = event;
}
  coverImageCropped(event: ImageCroppedEvent) {
    this.coverCroppedImage = event.base64;
    this.coverFile = base64ToFile(this.coverCroppedImage);
  }

  profileFileChangeEvent(event: any): void {
    this.profileImageChangedEvent = event;
}
  profileImageCropped(event: ImageCroppedEvent) {
    this.profileCroppedImage = event.base64;
    this.profileFile = base64ToFile(this.profileCroppedImage);
  }

  onSaveProfile() {
    this.isLoading = true;
    this.profileService.addProfile(
      this.profileForm.value.about,
      this.profileForm.value.web,
      this.profileForm.value.employees,
      this.profileForm.value.year,
      this.profileForm.value.workingHours
    );
    this.profileService.addCoverPhoto(
      this.coverFile
    );
    this.profileService.addProfilePhoto(
      this.profileFile
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
