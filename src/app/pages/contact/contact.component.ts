import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ContactService } from "./contact.service";
import AWN from "awesome-notifications";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"]
})
export class ContactComponent {

  contactForm: FormGroup;
  isLoading = false;
  submitted = false;
  notifier = new AWN();

  constructor(private contactService: ContactService) {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required),
    });
  }

  onContact() {
    this.submitted = true;
    this.isLoading = true;
    if (this.contactForm.invalid) {
      return;
    }
    this.contactService.send(
      this.contactForm.value.name,
      this.contactForm.value.email,
      this.contactForm.value.message
    ).subscribe(()=>{
      this.notifier.success('Message sent');
      this.isLoading = false;
    });
  }
}
