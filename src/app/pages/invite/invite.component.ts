import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { InviteService } from "./invite.service";
import AWN from "awesome-notifications";

@Component({
  selector: "app-start-page",
  templateUrl: "./invite.component.html",
  styleUrls: ["./invite.component.css"]
})
export class InviteComponent {
  isLoading = false;
  private authStatusSub: Subscription;
  submitted = false;
  inviteForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  notifier = new AWN();

  constructor(public authService: AuthService, private inviteService: InviteService) {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onInvite() {
    this.submitted = true;
    if (this.inviteForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.inviteService.inviteUser(this.inviteForm.value.email);
    this.notifier.success('Invitation email sent');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
