import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { TransportService } from "../transport.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-transport-create",
  templateUrl: "./transport-create.component.html",
  styleUrls: ["./transport-create.component.css"]
})
export class TransportCreateComponent implements OnInit {
  isLoading = false;
  transportForm: FormGroup;
  submitted = false;
  trucks = [];

  constructor(
    public transportService: TransportService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb:FormBuilder
  ) {
  }

  ngOnInit() {
    this.transportForm = new FormGroup({
      transportDate: new FormControl('', Validators.required),
      no: new FormControl('', Validators.required),
      start: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      placekg: new FormControl('', Validators.required),
      truckId: new FormControl('', Validators.required)
    });
    this.transportService.getTrucksByUserId(this.authService.getUserId()).subscribe((result) => {
      this.trucks = result.trucks;
    });
  }

  onSaveTransport() {
    this.submitted = true;
    if (this.transportForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.transportService.addTransport(
      this.transportForm.value.transportDate,
      this.transportForm.value.no,
      this.transportForm.value.placekg,
      this.transportForm.value.start,
      this.transportForm.value.destination,
      this.transportForm.value.description,
      this.transportForm.value.truckId
    );
  }
}
