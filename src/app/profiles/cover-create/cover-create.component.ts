import { ProfileService } from "../profile.service";
import { Profile } from "../profile.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { mimeType } from "../profile-create/mime-type.validator";
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: "app-post-create",
  templateUrl: "./cover-create.component.html",
  styleUrls: ["./cover-create.component.css"]
})
export class CoverCreateComponent implements OnInit, OnDestroy {
  profile: Profile;
  isLoading = false;
  coverForm: FormGroup;
  private authStatusSub: Subscription;
  coverImageChangedEvent: any = '';
  coverCroppedImage: any = '';
  coverCropperStaticWidth: any = 1200;
  coverCropperStaticHeight: any = 400;
  coverFile: any = '';

  constructor(
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.coverForm = new FormGroup({
      coverPhoto: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      })
    });
  }

  coverFileChangeEvent(event: any): void {
    this.coverImageChangedEvent = event;
}
  coverImageCropped(event: ImageCroppedEvent) {
    this.coverCroppedImage = event.base64;
    this.coverFile = base64ToFile(this.coverCroppedImage);
  }

  onSaveCover() {
    this.isLoading = true;
    this.profileService.addCoverPhoto(
      this.coverFile
    ).subscribe(()=> {
      this.router.navigate(["/showMyProfile"]);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
