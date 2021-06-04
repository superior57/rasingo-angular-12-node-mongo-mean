import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { FooterService } from "./footer.service";


@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {

  isLoading = false;
  newsletterForm: FormGroup;
  submitted = false;


  constructor(public footerService: FooterService) {

  }

  ngOnInit() {
    this.newsletterForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onAddEmail() {
    this.submitted = true;
    if (this.newsletterForm.invalid) {
      return;
    }
    this.footerService.addEmail(this.newsletterForm.value.email);
  }
}
