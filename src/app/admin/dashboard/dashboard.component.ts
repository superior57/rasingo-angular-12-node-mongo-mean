import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class AdminDashboardComponent {

  constructor(private router: Router) {

  }
}
