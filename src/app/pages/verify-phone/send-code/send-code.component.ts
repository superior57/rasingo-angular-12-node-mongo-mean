import { Component} from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { PhoneService } from "../phone.service";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./send-code.component.html",
  styleUrls: ["./send-code.component.css"]
})
export class SendCodeComponent {

  sendPCForm: FormGroup;
  isLoading = false;
  submitted = false;
  dialCode = "";
  telephone = "";

  constructor(private router: Router, public phoneService: PhoneService, public authService: AuthService) {

  }

  ngOnInit() {
    this.sendPCForm = new FormGroup({});
    this.authService.getUser(this.authService.getUserId()).subscribe(result => {
      this.dialCode = result.dialCode;
      this.telephone = result.telephone;
    });
  }

  onSendPC() {
    this.submitted = true;
    if (this.sendPCForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.phoneService.sendPC();
  }
}
