import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-start-page",
  templateUrl: "./confirm-email-sent.component.html",
  styleUrls: ["./confirm-email-sent.component.css"]
})
export class ConfirmEmailSentComponent {

  constructor(private router: Router) {

  }

  email = this.router.getCurrentNavigation().extras.state.email;
}
