import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Cargo } from "../cargo.model";
import { CargosService } from "../cargo.service";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cargo-list",
  templateUrl: "./cargo-list-firm.component.html",
  styleUrls: ["./cargo-list-firm.component.css"]
})
export class CargoListFirmComponent {
  cargos: Cargo[] = [];
  isLoading = false;
  chooseTransporterForm: FormGroup;
  private cargosSub: Subscription

  constructor(
    public cargosService: CargosService,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cargosService.getCargosByUserId();
    this.cargosSub = this.cargosService
      .getCargoUpdateListener2()
      .subscribe((userData: { cargos: Cargo[]; }) => {
        this.isLoading = false;
        this.cargos = userData.cargos;
      });
    this.chooseTransporterForm = new FormGroup({});
  }

  toDateFormat(param){
    return new Date(param).toString();
  }

  onChooseTransporter(signupId: string) {
    this.isLoading = true;
    this.cargosService.chooseTransporter(
      signupId,
    )
  }
}
