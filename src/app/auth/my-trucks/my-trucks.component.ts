import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Truck } from "src/app/cargo/truck.model";
import { AuthService } from "../auth.service";
import { plusValidator} from "../../validators/plus.validator";
import AWN from "awesome-notifications";

@Component({
  selector: "app-my-trucks",
  templateUrl: "./my-trucks.component.html",
  styleUrls: ["./my-trucks.component.css"]
})
export class MyTrucksComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;
  submitted = false;
  passwordForm: FormGroup;
  emailForm: FormGroup;
  private trucksSub: Subscription;
  trucks: Truck[] = [];
  truckForm: FormGroup;
  docs = [];
  years = [];
  notifier = new AWN();

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb:FormBuilder
  ) {
    this.truckForm = this.fb.group({
      trucks: this.fb.array([])
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
    });
    this.authService.getMyTrucks();
    this.trucksSub = this.authService
      .getTruckUpdateListener()
      .subscribe((truckData: { trucks: Truck[] }) => {
        this.isLoading = false;
        this.trucks = truckData.trucks;
      });
      this.years = this.generateArrayOfYears();
  }

  onDeleteTruck(truckId: string) {
    let onOk = () => {
      this.isLoading = true;
      this.authService.deleteTruck(truckId).subscribe(() => {
        this.authService.getMyTrucks();
      }, () => {
        this.isLoading = false;
      });
      this.notifier.success('Truck deleted');
    };
    let onCancel = () => {
      this.isLoading = false;
    };
    this.notifier.confirm(
      'Are you sure you want to delete truck?',
      onOk,
      onCancel,
      {
        labels: {
          confirm: 'Dangerous action'
        }
      }
    )
  }

  onTLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.newTrucks();
    arrayControl.at(i).patchValue({"TLic": file});
    arrayControl.at(i).get("TLic").updateValueAndValidity();
  }

  onLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.newTrucks();
    arrayControl.at(i).patchValue({"Lic": file});
    arrayControl.at(i).get("Lic").updateValueAndValidity();
  }

  onCMRLicPicked(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files[0];
    let arrayControl = this.newTrucks();
    arrayControl.at(i).patchValue({"CMRLic": file});
    arrayControl.at(i).get("CMRLic").updateValueAndValidity();
  }

  newTrucks() : FormArray {
    return this.truckForm.get("trucks") as FormArray
  }

  newTruck(): FormGroup {
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
    this.newTrucks().push(this.newTruck());
  }

  removeTruck(i:number) {
    this.newTrucks().removeAt(i);
  }

  onSaveTrucks() {
    this.submitted = true;
    if(this.submitted) {
      const trucksField = this.truckForm.get('trucks');
      trucksField.setValidators([plusValidator]);
      trucksField.updateValueAndValidity();
    }
    let arrayControl = this.newTrucks();
    for(var i = 0; i < this.newTrucks().length; i++ ) {
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
    this.truckForm.updateValueAndValidity();
    if (this.truckForm.invalid) {
      return;
    }
    for(var i = 0; i < this.newTrucks().length; i++) {
      this.docs[i] = [];
      this.docs[i].push(arrayControl.at(i).value.TLic);
      this.docs[i].push(arrayControl.at(i).value.Lic);
      this.docs[i].push(arrayControl.at(i).value.CMRLic);
    }
    this.isLoading = true;
    this.authService.addNewTrucks(
      this.truckForm.value.trucks,
      this.docs
    );
    this.notifier.success('Truck saved');
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

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
