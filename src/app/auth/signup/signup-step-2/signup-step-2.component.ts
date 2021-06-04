import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./signup-step-2.component.html",
  styleUrls: ["./signup-step-2.component.css"]
})
export class SignupStep2Component implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  userType = '';
  firmOnly = false;
  public userTypeSelected: string;
  docsForm: FormGroup;

  constructor(private fb:FormBuilder, public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.docsForm = new FormGroup({
      isr: new FormControl(null, {
        validators: [Validators.required]
      }),
      lmp: new FormControl(null, {
        validators: [Validators.required]
      }),
      pocmr: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    if(this.authService.getIsAuth()) {
      this.authService.getUser(this.authService.getUserId())
        .subscribe(result => {
          this.userType = result.userType;
          if (this.userType == 'firms') {
            this.firmOnly = true;
          }
      });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onISRPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.docsForm.patchValue({ isr: file });
    this.docsForm.get("isr").updateValueAndValidity();
  }

  onLMPPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.docsForm.patchValue({ lmp: file });
    this.docsForm.get("lmp").updateValueAndValidity();
  }

  onPOCMRPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.docsForm.patchValue({ pocmr: file });
    this.docsForm.get("pocmr").updateValueAndValidity();
  }

  onSaveDocs() {
    this.isLoading = true;
    if(this.userType == 'firms') {
      this.authService.addDocs(
        this.docsForm.value.isr,
        "isr"
      );
    }
    else {
      this.authService.addDocs(
        this.docsForm.value.isr,
        "isr"
      );
      this.authService.addDocs(
        this.docsForm.value.lmp,
        "lmp"
      );
      this.authService.addDocs(
        this.docsForm.value.pocmr,
        "pocmr"
      );
    }
    this.authService.createUserStep2(3);
  }
}
