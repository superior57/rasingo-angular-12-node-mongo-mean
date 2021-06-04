import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { Cargo } from "../cargo.model";
import { CargosService } from "../cargo.service";
import { Truck } from "../truck.model";


@Component({
  selector: "app-cargo-list",
  templateUrl: "./my-cargo-list.component.html",
  styleUrls: ["./my-cargo-list.component.css"]
})
export class MyCargoListComponent {
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
  trucks: Truck[] = [];
  areTrucks = false;
  cargoSignupForm: FormGroup;

  tRuleWidth: any = 0;
  tRuleHeight: any = 0;
  tRuleLength: any = 0;

  tRuleMaxWeightADR:any = false;
  tRuleMaxWeightREFRIGIRATED:any = false;
  tRuleMaxWeightINDLIQ:any = false;
  tRuleMaxWeightFOODLIQ:any = false;
  tRuleMaxWeightINDBULK:any = false;
  tRuleMaxWeightFOODBULK:any = false;
  tRuleMaxWeightSPECIAL:any = false;
  tRuleMaxWeightCONTAINER:any = false;
  tRuleMaxWeightNOTPALLETIZED:any = false;
  tRuleMaxWeightPALLETIZED:any = false;
  tRuleMaxWeightVEHICLES:any = false;
  tRuleMaxWeightSPECIALLENGTHS:any = false;
  tRuleMaxWeightSPECIALHEIGHTS:any = false;
  tRuleMaxWeightHANG:any = false;
  tRuleMaxWeightANIMALS:any = false;

  cRuleADR:any = false;
  cRuleREFRIGIRATED:any = false;
  cRuleINDLIQ:any = false;
  cRuleFOODLIQ:any = false;
  cRuleINDBULK:any = false;
  cRuleFOODBULK:any = false;
  cRuleSPECIAL:any = false;
  cRuleCONTAINER:any = false;
  cRuleNOTPALLETIZED:any = false;
  cRulePALLETIZED:any = false;
  cRuleVEHICLES:any = false;
  cRuleSPECIALLENGTHS:any = false;
  cRuleSPECIALHEIGHTS:any = false;
  cRuleHANG:any = false;
  cRuleANIMALS:any = false;

  constructor(
    public cargosService: CargosService,
    public route: ActivatedRoute,
    public authService: AuthService,
    private fb:FormBuilder
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cargosService.getTruckRulesByUserId(this.authService.getUserId()).subscribe(result => {
      this.trucks = result.trucks;
      var specialTruckFinished = false;
      var adrTruckFinished = false;
      var indLiqTruckFinished = false;
      var tipperTruckFinished = false;
      var foodBulkTruckFinished = false;
      var refrigeratedTruckFinished = false;
      var foodLiqTruckFinished = false;
      var containerTruckFinished = false;
      var animalsTruckFinished = false;
      var vehiclesTruckFinished = false;
      var truckVanHangFinished = false;
      var truckHalfTrailerFinished = false;
      var truckTrailerFinished = false;
      var truckFinished = false;
      var combiFinished = false;
      var caddyFinished = false;

      for(let i = 0; i < this.trucks.length; i++) {
        /*Container dimensions rules*/
        if(this.tRuleHeight < this.trucks[i].height) {
          this.tRuleHeight = this.trucks[i].height;
        }
        if(this.tRuleWidth < this.trucks[i].width) {
          this.tRuleWidth = this.trucks[i].width;
        }
        if(this.tRuleLength < this.trucks[i].tlength) {
          this.tRuleLength = this.trucks[i].tlength;
        }

        /*Truck special rules*/
        if(this.trucks[i].truckType == 'truck_special' && !specialTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_special') {
              this.tRuleMaxWeightSPECIAL += this.trucks[j].maxWeight;
              this.tRuleMaxWeightADR += this.trucks[j].maxWeight;
              this.tRuleMaxWeightSPECIALHEIGHTS += this.trucks[j].maxWeight;
              this.tRuleMaxWeightSPECIALLENGTHS += this.trucks[j].maxWeight;
            }
          }
          specialTruckFinished = true;
          this.cRuleADR = 'adr';
          this.cRuleSPECIALLENGTHS = 'special_lenghts';
          this.cRuleSPECIALHEIGHTS = 'special_heights';
          this.cRuleSPECIAL = 'special';
        }

        /*ADR Truck rules*/
        if(this.trucks[i].truckType == 'truck_adr' && !adrTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_adr') {
              this.tRuleMaxWeightINDLIQ += this.trucks[j].maxWeight;
              this.tRuleMaxWeightADR += this.trucks[j].maxWeight;
            }
          }
          adrTruckFinished = true;
          this.cRuleADR = 'adr';
          this.cRuleINDLIQ = 'ind_liq';
        }

        /*Ind. liq. cistern rule*/
        if(this.trucks[i].truckType == 'cistern_ind_liq' && !indLiqTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'cistern_ind_liq') {
              this.tRuleMaxWeightINDLIQ += this.trucks[j].maxWeight;
              this.tRuleMaxWeightADR += this.trucks[j].maxWeight;
            }
          }
          indLiqTruckFinished = true;
          this.cRuleADR = 'adr';
          this.cRuleINDLIQ = 'ind_liq';
        }

        /*Tipper rules*/
        if(this.trucks[i].truckType == 'truck_tipper' && !tipperTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_tipper') {
              this.tRuleMaxWeightINDBULK += this.trucks[j].maxWeight;
              this.tRuleMaxWeightFOODBULK += this.trucks[j].maxWeight;
            }
          }
          tipperTruckFinished = true;
          this.cRuleINDBULK = 'ind_bulk';
          this.cRuleFOODBULK = 'food_bulk';
        }

        /*Truck refrigirated rules*/
        if(this.trucks[i].truckType == 'truck_refrigerated' && !refrigeratedTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_refrigerated') {
              this.tRuleMaxWeightREFRIGIRATED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          refrigeratedTruckFinished = true;
          this.cRuleREFRIGIRATED = 'refrigerated';
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

         /*Truck food bulk rules*/
         if(this.trucks[i].truckType == 'truck_food_bulk' && !foodBulkTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_food_bulk') {
              this.tRuleMaxWeightFOODBULK += this.trucks[j].maxWeight;
              this.tRuleMaxWeightINDBULK += this.trucks[j].maxWeight;
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          foodBulkTruckFinished = true;
          this.cRuleFOODBULK = 'food_bulk';
          this.cRuleINDBULK = 'ind_bulk';
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }
        /*Cistern food liq rules*/
        if(this.trucks[i].truckType == 'cistern_food_liq' && !foodLiqTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'cistern_food_liq') {
              this.tRuleMaxWeightFOODLIQ += this.trucks[j].maxWeight;
            }
          }
          foodLiqTruckFinished = true;
          this.cRuleFOODLIQ = 'food_liq';
        }

        /*Container truck rules*/
        if(this.trucks[i].truckType == 'truck_container' && !containerTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_container') {
              this.tRuleMaxWeightCONTAINER += this.trucks[j].maxWeight;
            }
          }
          containerTruckFinished = true;
          this.cRuleCONTAINER = 'container';
        }

        /*Animals truck rules*/
        if(this.trucks[i].truckType == 'truck_animals' && !animalsTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_animals') {
              this.tRuleMaxWeightANIMALS += this.trucks[j].maxWeight;
            }
          }
          animalsTruckFinished = true;
          this.cRuleANIMALS = 'animals';
        }

        /*Vehicles truck rules*/
        if(this.trucks[i].truckType == 'truck_vehicles' && !vehiclesTruckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_vehicles') {
              this.tRuleMaxWeightVEHICLES += this.trucks[j].maxWeight;
            }
          }
          vehiclesTruckFinished = true;
          this.cRuleVEHICLES = 'vehicles';
        }

        /*Truck van hang rules*/
        if(this.trucks[i].truckType == 'truck_van_hang' && !truckVanHangFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_van_hang') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightHANG += this.trucks[j].maxWeight;
            }
          }
          truckVanHangFinished = true;
          this.cRuleHANG = 'hang';
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

        /*Truck half trailer*/
        if(this.trucks[i].truckType == 'truck_half_trailer' && !truckHalfTrailerFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_half_trailer') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightFOODBULK += this.trucks[j].maxWeight;
            }
          }
          truckHalfTrailerFinished = true;
          this.cRuleFOODBULK = 'food_bulk';
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

        /*Truck trailer*/
        if(this.trucks[i].truckType == 'truck_trailer' && !truckTrailerFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck_trailer') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          truckTrailerFinished = true;
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

        /*Truck rules*/
        if(this.trucks[i].truckType == 'truck' && !truckFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'truck') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          truckFinished = true;
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

        /*Combi rules*/
        if(this.trucks[i].truckType == 'combi' && !combiFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'combi') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          combiFinished = true;
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }

        /*Caddy rules*/
        if(this.trucks[i].truckType == 'caddy' && !caddyFinished) {
          for(let j = 0; j < this.trucks.length; j++) {
            if(this.trucks[j].truckType == 'caddy') {
              this.tRuleMaxWeightNOTPALLETIZED += this.trucks[j].maxWeight;
              this.tRuleMaxWeightPALLETIZED += this.trucks[j].maxWeight;
            }
          }
          caddyFinished = true;
          this.cRulePALLETIZED = 'palletized';
          this.cRuleNOTPALLETIZED = 'not_palletized';
        }
      }
      this.cargosService.getMyCargos(
        this.cargosPerPage,
        this.currentPage,
        this.tRuleHeight,
        this.tRuleWidth,
        this.tRuleLength,
        this.tRuleMaxWeightINDBULK,
        this.tRuleMaxWeightFOODBULK,
        this.tRuleMaxWeightADR,
        this.tRuleMaxWeightPALLETIZED,
        this.tRuleMaxWeightNOTPALLETIZED,
        this.tRuleMaxWeightINDLIQ,
        this.tRuleMaxWeightFOODLIQ,
        this.tRuleMaxWeightREFRIGIRATED,
        this.tRuleMaxWeightSPECIALLENGTHS,
        this.tRuleMaxWeightANIMALS,
        this.tRuleMaxWeightHANG,
        this.tRuleMaxWeightSPECIALHEIGHTS,
        this.tRuleMaxWeightSPECIAL,
        this.tRuleMaxWeightVEHICLES,
        this.tRuleMaxWeightCONTAINER,
        this.cRuleADR,
        this.cRuleANIMALS,
        this.cRuleCONTAINER,
        this.cRuleFOODBULK,
        this.cRuleFOODLIQ,
        this.cRuleHANG,
        this.cRuleINDBULK,
        this.cRuleINDLIQ,
        this.cRuleNOTPALLETIZED,
        this.cRulePALLETIZED,
        this.cRuleREFRIGIRATED,
        this.cRuleSPECIAL,
        this.cRuleSPECIALHEIGHTS,
        this.cRuleSPECIALLENGTHS,
        this.cRuleVEHICLES
      );
    });
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
      if(this.authService.getIsAuth()) {
        this.authService.getUser(this.authService.getUserId()).subscribe(result => {
          if(result.userType == 'drivers' || result.userType == 'both') {
            this.areTrucks = true;
            this.cargosService.getTrucksByUserId(this.authService.getUserId()).subscribe((result) => {
              this.trucks = result.trucks;
            });
          }
        });
      }
      this.cargoSignupForm = new FormGroup({
        truckId: new FormControl('', Validators.required),
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

  onSignupForCargo(cargoId: string) {
    this.isLoading = true;
    this.cargosService.signupForCargo(
      cargoId,
      this.cargoSignupForm.value.truckId
    )
  }
}
