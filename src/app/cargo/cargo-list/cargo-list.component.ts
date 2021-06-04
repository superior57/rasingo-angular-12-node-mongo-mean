import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PageEvent} from "@angular/material/paginator";
import { Cargo } from "../cargo.model";
import { Truck } from "../truck.model";
import { CargosService } from "../cargo.service";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-cargo-list",
  templateUrl: "./cargo-list.component.html",
  styleUrls: ["./cargo-list.component.css"]
})
export class CargoListComponent {
  cargos: Cargo[] = [];
  isLoading = false;
  totalCargos = 0;
  cargosPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [3, 20, 50, 100];
  userIsAuthenticated = false;
  userId: string;
  private cargosSub: Subscription;
  private authStatusSub: Subscription;
  private cargoId: string;

  constructor(
    public cargosService: CargosService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cargosService.getCargos(this.cargosPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.cargosSub = this.cargosService
      .getCargoUpdateListener()
      .subscribe((cargoData: { cargos: Cargo[]; cargoCount: number }) => {
        this.isLoading = false;
        this.totalCargos = cargoData.cargoCount;
        this.cargos = cargoData.cargos;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.cargosPerPage = pageData.pageSize;
    this.cargosService.getCargos(this.cargosPerPage, this.currentPage);
  }

  onDelete(cargoId: string) {
    this.isLoading = true;
    this.cargosService.deleteCargo(cargoId).subscribe(() => {
      this.cargosService.getCargos(this.cargosPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.cargosSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  toDateFormat(param){
    return new Date(param).toString();
  }
}
