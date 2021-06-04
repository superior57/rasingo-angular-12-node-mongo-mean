import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PageEvent} from "@angular/material/paginator";
import { Transport } from "../transport.model";
import { Truck } from "../truck.model";
import { TransportService } from "../transport.service";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-cargo-list",
  templateUrl: "./transport-list.component.html",
  styleUrls: ["./transport-list.component.css"]
})
export class TransportListComponent {

  transports: Transport[] = [];
  isLoading = false;
  private transportsSub: Subscription;
  totalTransports = 0;
  transportsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [2, 20, 50, 100];

  constructor(
    public transportService: TransportService,
    public route: ActivatedRoute,
    public authService: AuthService,
    private fb:FormBuilder
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.transportService.getTransports(this.transportsPerPage, this.currentPage);
    this.transportsSub = this.transportService
      .getTransportUpdateListener()
      .subscribe((transportData: { transports: Transport[]; transportCount: number }) => {
        this.isLoading = false;
        this.totalTransports = transportData.transportCount;
        this.transports = transportData.transports;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.transportsPerPage = pageData.pageSize;
    this.transportService.getTransports(this.transportsPerPage, this.currentPage);
  }
}
