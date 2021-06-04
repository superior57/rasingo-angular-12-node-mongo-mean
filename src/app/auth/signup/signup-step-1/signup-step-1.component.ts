import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth.service";
import * as countries from "../../../countries.json";
import { plusValidator} from "../../../validators/plus.validator";

@Component({
  templateUrl: "./signup-step-1.component.html",
  styleUrls: ["./signup-step-1.component.css"]
})
export class SignupStep1Component implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  userTypeSelected = '';
  companyForm: FormGroup;
  countries: any = (countries as any).default;
  submitted = false;
  added = false;
  years = [];
  docs = [];

  constructor(private fb:FormBuilder, public authService: AuthService) {
    this.companyForm = this.fb.group({
      trucks: this.fb.array([]),
      companyName: new FormControl('', Validators.required),
      taxNo: new FormControl('', Validators.required),
      dialCode: new FormControl('', Validators.required),
      telephone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      userType: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.years = this.generateArrayOfYears();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignupStep1() {
    this.submitted = true;
    this.added = true;
    if(this.userTypeSelected === 'drivers' || this.userTypeSelected === 'both') {
      const trucksField = this.companyForm.get('trucks');
      trucksField.setValidators([plusValidator]);
      trucksField.updateValueAndValidity();
    }
    let arrayControl = this.trucks();
    for(var i = 0; i < this.trucks().length; i++ ) {
      if(
        arrayControl.at(i).value.truckType == 'truck_refrigerated' ||
        arrayControl.at(i).value.truckType == 'truck' ||
        arrayControl.at(i).value.truckType == 'truck_van_hang' ||
        arrayControl.at(i).value.truckType == 'truck_half_trailer' ||
        arrayControl.at(i).value.truckType == 'truck_trailer' ||
        arrayControl.at(i).value.truckType == 'truck_special' ||
        arrayControl.at(i).value.truckType == 'truck_container' ||
        arrayControl.at(i).value.truckType== 'truck_vehicles' ||
        arrayControl.at(i).value.truckType == 'combi' ||
        arrayControl.at(i).value.truckType == 'caddy'
      ) {
        arrayControl.at(i).get('width').setValidators([Validators.required,Validators.pattern("[0-9]{1,2}\.[0-9]{1,2}")]);
        arrayControl.at(i).get('width').updateValueAndValidity();
        arrayControl.at(i).get('tlength').setValidators([Validators.required,Validators.pattern("[0-9]{1,2}\.[0-9]{1,2}")]);
        arrayControl.at(i).get('tlength').updateValueAndValidity();
        arrayControl.at(i).get('height').setValidators([Validators.required,Validators.pattern("[0-9]{1,2}\.[0-9]{1,2}")]);
        arrayControl.at(i).get('height').updateValueAndValidity();
      }
    }
    this.companyForm.updateValueAndValidity();
    if (this.companyForm.invalid) {
      return;
    }
    for(var i = 0; i < this.trucks().length; i++) {
      this.docs[i] = [];
      this.docs[i].push(arrayControl.at(i).value.TLic);
      this.docs[i].push(arrayControl.at(i).value.Lic);
      this.docs[i].push(arrayControl.at(i).value.CMRLic);
    }
    console.log("t"+ this.docs[0]);
    console.log("t"+ this.docs[1]);
    console.log("t"+ this.docs[2]);
    this.isLoading = true;
    this.authService.createUserStep1(
      this.companyForm.value.companyName,
      this.companyForm.value.taxNo,
      this.companyForm.value.dialCode,
      this.companyForm.value.telephone,
      this.companyForm.value.address,
      this.companyForm.value.city,
      this.companyForm.value.country,
      this.companyForm.value.postalCode,
      this.companyForm.value.userType,
      2,
      this.companyForm.value.trucks,
      this.docs
    );
  }

  onTLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.trucks();
    arrayControl.at(i).patchValue({"TLic": file});
    arrayControl.at(i).get("TLic").updateValueAndValidity();
  }

  onLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.trucks();
    arrayControl.at(i).patchValue({"Lic": file});
    arrayControl.at(i).get("Lic").updateValueAndValidity();
  }

  onCMRLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.trucks();
    arrayControl.at(i).patchValue({"CMRLic": file});
    arrayControl.at(i).get("CMRLic").updateValueAndValidity();
  }

  trucks() : FormArray {
    return this.companyForm.get("trucks") as FormArray
  }

  newTruck(): FormGroup {
    this.added = false;
    return this.fb.group({
      truckModel: new FormControl('', Validators.required),
      truckType: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      euroNorm: new FormControl('', Validators.required),
      regNumber: new FormControl('', Validators.required),
      regDate: new FormControl('', Validators.required),
      maxWeight: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      width: new FormControl(),
      height: new FormControl(),
      tlength: new FormControl(),
      hydraulicRamp: new FormControl(),
      crane: new FormControl(),
      winches: new FormControl(),
      adjustableRoof: new FormControl(),
      movableFloor: new FormControl(),
      movableTarpaulin: new FormControl(),
      rotatingSignalLight: new FormControl(),
      containerLifter: new FormControl(),
      TLic: new FormControl(null, Validators.required
      ),
      Lic: new FormControl(null, Validators.required
      ),
      CMRLic: new FormControl(null, Validators.required
      )
    })
  }

  addTruck() {
    this.trucks().push(this.newTruck());
  }

  removeTruck(i:number) {
    this.trucks().removeAt(i);
  }

  generateArrayOfYears() {
    var max = new Date().getFullYear()
    var min = max - 31
    var years = []

    for (var i = max; i >= min; i--) {
      years.push(i)
    }
    return years
  }
}
