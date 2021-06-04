import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { Newsletter } from "./newsletter.model";
import { Injectable } from "@angular/core";
import AWN from "awesome-notifications";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class FooterService {

  notifier = new AWN();

  constructor(private http: HttpClient, private router: Router) {}

  addEmail(email: string) {
    const newsletter: Newsletter = {
      email: email
    }
    this.http
      .post(BACKEND_URL + "addNewsletterEmail/", newsletter)
      .subscribe(response => {
        this.notifier.success('Email added');
      });
  }
}
