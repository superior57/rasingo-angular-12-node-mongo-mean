import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CargosService } from "../cargo.service";
import { Cargo } from "../cargo.model";
import { AuthService } from "../../auth/auth.service";
import * as countries from "../../countries.json";
import { plusValidator} from "../../validators/plus.validator";

@Component({
  selector: "app-cargo-create",
  templateUrl: "./cargo-create.component.html",
  styleUrls: ["./cargo-create.component.css"]
})
export class CargoCreateComponent implements OnInit, OnDestroy {
  cargo: Cargo;
  isLoading = false;
  cargoForm: FormGroup;
  private cargoId: string;
  private authStatusSub: Subscription;
  countries: any = (countries as any).default;
  submitted = false;
  added = false;
  cargoTypeSelected = '';

  constructor(
    public cargoService: CargosService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb:FormBuilder
  ) {
    this.cargoForm = new FormGroup({
      price: new FormControl('', [Validators.required, Validators.pattern("[0-9]{1,2}\.[0-9]{1,2}")]),
      weight: new FormControl('', [Validators.required, Validators.pattern("[0-9]{1,2}\.[0-9]{1,2}")]),
      loads: this.fb.array([],[plusValidator]),
      unLoads: this.fb.array([],[plusValidator]),
      description: new FormControl(),
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }


  onSaveCargo() {
    this.submitted = true;
    this.added = true;
    if (this.cargoForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.cargoService.addCargo(
      this.cargoForm.value.description,
      this.cargoTypeSelected,
      this.cargoForm.value.price,
      this.cargoForm.value.weight,
      this.cargoForm.value.loads,
      this.cargoForm.value.unLoads
    );
  }

  get f() {
    return this.cargoForm.controls;
  }

  loads() : FormArray {
    return this.cargoForm.get("loads") as FormArray
  }

  unLoads() : FormArray {
    return this.cargoForm.get("unLoads") as FormArray
  }

  newLoad(): FormGroup {
    this.added = false;
    return this.fb.group({
      loadAddress: new FormControl('', Validators.required),
      loadCity: new FormControl('', Validators.required),
      loadCountry: new FormControl('', Validators.required),
      loadDate: new FormControl('', Validators.required),
      loadTime: new FormControl('', Validators.required)
    });
  }

  newUnLoad(): FormGroup {
    this.added = false;
    return this.fb.group({
      unLoadAddress: new FormControl('', Validators.required),
      unLoadCity: new FormControl('', Validators.required),
      unLoadCountry: new FormControl('', Validators.required),
      unLoadDate: new FormControl('', Validators.required),
      unLoadTime: new FormControl('', Validators.required)
    });
  }

  addLoad() {
    this.loads().push(this.newLoad());
  }

  addUnLoad() {
    this.unLoads().push(this.newUnLoad());
  }

  removeLoad(i:number) {
    this.loads().removeAt(i);
  }

  removeUnLoad(i:number) {
    this.unLoads().removeAt(i);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
