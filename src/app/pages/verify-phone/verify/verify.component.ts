import { Component} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { PhoneService } from "../phone.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./verify.component.html",
  styleUrls: ["./verify.component.css"]
})
export class VerifyPhoneComponent {

  verifyPhoneForm: FormGroup;
  isLoading = false;
  submitted = false;
  sentMessage = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public phoneService: PhoneService) {

  }

  ngOnInit() {
    this.verifyPhoneForm = new FormGroup({
      phoneCode: new FormControl('', Validators.required),
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.sentMessage = params['sentMessage'];
    });
  }

  onVerifyPhone() {
    this.submitted = true;
    if (this.verifyPhoneForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.phoneService.verifyPhone(this.verifyPhoneForm.value.phoneCode);
  }
}
