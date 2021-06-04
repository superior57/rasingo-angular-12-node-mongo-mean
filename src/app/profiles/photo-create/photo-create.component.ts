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
  selector: "app-photo-create",
  templateUrl: "./photo-create.component.html",
  styleUrls: ["./photo-create.component.css"]
})
export class PhotoCreateComponent implements OnInit, OnDestroy {
  profile: Profile;
  isLoading = false;
  photoForm: FormGroup;
  private authStatusSub: Subscription;
  photoImageChangedEvent: any = '';
  photoCroppedImage: any = '';
  photoCropperStaticWidth: any = 200;
  photoCropperStaticHeight: any = 200;
  photoFile: any = '';

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
    this.photoForm = new FormGroup({
      photoPhoto: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      })
    });
  }

  photoFileChangeEvent(event: any): void {
    this.photoImageChangedEvent = event;
}
  photoImageCropped(event: ImageCroppedEvent) {
    this.photoCroppedImage = event.base64;
    this.photoFile = base64ToFile(this.photoCroppedImage);
  }

  onSavePhoto() {
    this.isLoading = true;
    this.profileService.addProfilePhoto(
      this.photoFile
    ).subscribe(()=> {
      this.router.navigate(["/showMyProfile"]);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
