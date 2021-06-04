import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Cargo } from "../cargo.model";
import { CargosService } from "../cargo.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-cargo-list",
  templateUrl: "./cargo-list-firm.component.html",
  styleUrls: ["./cargo-list-firm.component.css"]
})
export class CargoListFirmComponent {
  cargos: Cargo[] = [];
  isLoading = false;
  chooseTransporterForm: FormGroup;

  constructor(
    public cargosService: CargosService,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    if(this.authService.getIsAuth()) {
      this.cargosService.getCargosByUserId().subscribe((result) => {
        this.cargos = result.cargos;
        console.log(this.cargos);
      })
    }
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
