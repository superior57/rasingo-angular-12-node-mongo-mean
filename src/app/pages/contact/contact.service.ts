import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class ContactService {

  constructor(private http: HttpClient) {}

  send(name: string, email: string, message: string) {
    const send = {
      name: name,
      email:email,
      message: message
    }
    return this.http.post(BACKEND_URL + "/contact", send);
  }
}
