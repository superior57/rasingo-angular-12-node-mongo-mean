import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Cargo } from "./cargo.model";
import { CargoSignup } from "../signups/signups.model";
import { ChooseTransporter } from "./choose-transporter.model";
import AWN from "awesome-notifications";

const BACKEND_URL = environment.apiUrl + "/cargos/";
const BACKEND_URL_2 = environment.apiUrl + "/trucks/";
const BACKEND_URL_3 = environment.apiUrl + "/signups/";

@Injectable({ providedIn: "root" })
export class CargosService {
  private cargos: Cargo[] = [];
  private cargosUpdated = new Subject<{ cargos: Cargo[]; cargoCount: number }>();
  private cargosUpdated2 = new Subject<{ cargos: Cargo[]; }>();
  private cargoStatusListener = new Subject<boolean>();
  notifier = new AWN();

  constructor(private http: HttpClient, private router: Router) {}

  getCargos(cargosPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${cargosPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; cargos: any; maxCargos: number }>(
        BACKEND_URL + "getCargos/" + queryParams
      )
      .pipe(
        map(cargoData => {
          return {
            cargos: cargoData.cargos.map(cargo => {
              return {
                description: cargo.description,
                cargoType: cargo.cargoType,
                price: cargo.price,
                id: cargo._id,
                creator: cargo.creator,
                loads: cargo.loads,
                unLoads: cargo.unLoads
              };
            }),
            maxCargos: cargoData.maxCargos
          };
        })
      )
      .subscribe(transformedCargoData => {
        this.cargos = transformedCargoData.cargos;
        this.cargosUpdated.next({
          cargos: [...this.cargos],
          cargoCount: transformedCargoData.maxCargos
        });
      });
  }

  getMyCargos(
    cargosPerPage: number,
    currentPage: number,
    tRuleHeight: number,
    tRuleWidth: number,
    tRuleLength: number,
    tRuleMaxWeightINDBULK: number,
    tRuleMaxWeightFOODBULK: number,
    tRuleMaxWeightADR: number,
    tRuleMaxWeightPALLETIZED: number,
    tRuleMaxWeightNOTPALLETIZED: number,
    tRuleMaxWeightINDLIQ: number,
    tRuleMaxWeightFOODLIQ: number,
    tRuleMaxWeightREFRIGIRATED: number,
    tRuleMaxWeightSPECIALLENGTHS: number,
    tRuleMaxWeightANIMALS: number,
    tRuleMaxWeightHANG: number,
    tRuleMaxWeightSPECIALHEIGHTS: number,
    tRuleMaxWeightSPECIAL: number,
    tRuleMaxWeightVEHICLES: number,
    tRuleMaxWeightCONTAINER: number,
    cRuleADR: any,
    cRuleANIMALS: any,
    cRuleCONTAINER: any,
    cRuleFOODBULK: any,
    cRuleFOODLIQ: any,
    cRuleHANG: any,
    cRuleINDBULK: any,
    cRuleINDLIQ: any,
    cRuleNOTPALLETIZED: any,
    cRulePALLETIZED: any,
    cRuleREFRIGIRATED: any,
    cRuleSPECIAL: any,
    cRuleSPECIALHEIGHTS: any,
    cRuleSPECIALLENGTHS: any,
    cRuleVEHICLES: any
    ) {
    const queryParams = `?pagesize=${cargosPerPage}&page=${currentPage}&tRuleHeight=${tRuleHeight}&tRuleWidth=${tRuleWidth}&tRuleLength=${tRuleLength}&tRuleMaxWeightINDBULK=${tRuleMaxWeightINDBULK}&tRuleMaxWeightFOODBULK=${tRuleMaxWeightFOODBULK}&tRuleMaxWeightADR=${tRuleMaxWeightADR}&tRuleMaxWeightPALLETIZED=${tRuleMaxWeightPALLETIZED}&tRuleMaxWeightNOTPALLETIZED=${tRuleMaxWeightNOTPALLETIZED}&tRuleMaxWeightINDLIQ=${tRuleMaxWeightINDLIQ}&tRuleMaxWeightFOODLIQ=${tRuleMaxWeightFOODLIQ}&tRuleMaxWeightREFRIGERATED=${tRuleMaxWeightREFRIGIRATED}&tRuleMaxWeightSPECIALLENGTHS=${tRuleMaxWeightSPECIALLENGTHS}&tRuleMaxWeightANIMALS=${tRuleMaxWeightANIMALS}&tRuleMaxWeightHANG=${tRuleMaxWeightHANG}&tRuleMaxWeightSPECIALHEIGHTS=${tRuleMaxWeightSPECIALHEIGHTS}&tRuleMaxWeightSPECIAL=${tRuleMaxWeightSPECIAL}&tRuleMaxWeightVEHICLES=${tRuleMaxWeightVEHICLES}&tRuleMaxWeightCONTAINER=${tRuleMaxWeightCONTAINER}&cRuleADR=${cRuleADR}&cRuleANIMALS=${cRuleANIMALS}&cRuleCONTAINER=${cRuleCONTAINER}&cRuleFOODBULK=${cRuleFOODBULK}&cRuleFOODLIQ=${cRuleFOODLIQ}&cRuleHANG=${cRuleHANG}&cRuleINDBULK=${cRuleINDBULK}&cRuleINDLIQ=${cRuleINDLIQ}&cRuleNOTPALLETIZED=${cRuleNOTPALLETIZED}&cRulePALLETIZED=${cRulePALLETIZED}&cRuleREFRIGERATED=${cRuleREFRIGIRATED}&cRuleSPECIAL=${cRuleSPECIAL}&cRuleSPECIALHEIGHTS=${cRuleSPECIALHEIGHTS}&cRuleSPECIALLENGTHS=${cRuleSPECIALLENGTHS}&cRuleVEHICLES=${cRuleVEHICLES}`;
    this.http
      .get<{ message: string; cargos: any; maxCargos: number }>(
        BACKEND_URL + "getMyCargos/" + queryParams
      )
      .pipe(
        map(cargoData => {
          return {
            cargos: cargoData.cargos.map(cargo => {
              return {
                description: cargo.description,
                cargoType: cargo.cargoType,
                price: cargo.price,
                id: cargo._id,
                creator: cargo.creator,
                loads: cargo.loads,
                unLoads: cargo.unLoads
              };
            }),
            maxCargos: cargoData.maxCargos
          };
        })
      )
      .subscribe(transformedCargoData => {
        this.cargos = transformedCargoData.cargos;
        this.cargosUpdated.next({
          cargos: [...this.cargos],
          cargoCount: transformedCargoData.maxCargos
        });
      });
  }

  getCargoUpdateListener() {
    return this.cargosUpdated.asObservable();
  }

  getCargoUpdateListener2() {
    return this.cargosUpdated2.asObservable();
  }

  getCargoStatusListener() {
    return this.cargoStatusListener.asObservable();
  }

  getCargoAndLoadsUnloads(cargoId):Observable<any>  {
    return this.http.get(BACKEND_URL + "getCargosAndLoadsUnloads/" + cargoId);
  }

  addCargo(description: string, cargoType: string, price: number, weight: number,  loads: Array<String>, unLoads: Array<String>) {
    const cargo = {
    description: description,
    cargoType: cargoType,
    price: price,
    weight: weight,
    loads: loads,
    unLoads: unLoads
    }
    this.http.post(BACKEND_URL + "addCargo/", cargo).subscribe(
      () => {
        this.router.navigate(["/firmSignUps"]);
        this.notifier.success('Cargo saved to DB');
      }
    );
  }

  getCMRData(signupId: string) {
    return this.http.get<{
      _id: string;
      userId: string;
      cargoId: string;
      truckId: string;
      approved: boolean;
      finished: boolean;
      truck: object;
      cargo: object;
      user: object;
    }>(BACKEND_URL_3 + "getSignupById/" + signupId);
  }

  addCMR(
    sender: string,
    intList: string,
    reciever: string,
    transporter: string,
    otherTransporters: string,
    placeOfDelivery: string,
    placeAndDateOfPickUp: string,
    remarks: string,
    accompanyingLists: string,
    label: string,
    parcelNum: string,
    typeOfPackaging: string,
    typeOfCargo: string,
    statisticNum: string,
    grossWeight: string,
    volume: string,
    instructions: string,
    deals: string,
    provisions: string,
    expensesSender: string,
    expensesCurrency: string,
    expensesReciever: string,
    residueSender: string,
    residueCurrency: string,
    residueReciever: string,
    totalSender: string,
    totalCurrency: string,
    totalReciever: string,
    turned: string,
    company: string,
    signatureSender: string,
    signatureTransporter: string,
    signatureReciever: string,
    signupId: string
  ) {
    const cmr = {
      sender: sender,
      intList: intList,
      reciever: reciever,
      transporter: transporter,
      otherTransporters: otherTransporters,
      placeOfDelivery: placeOfDelivery,
      placeAndDateOfPickUp: placeAndDateOfPickUp,
      remarks: remarks,
      accompanyingLists: accompanyingLists,
      label: label,
      parcelNum: parcelNum,
      typeOfPackaging: typeOfPackaging,
      typeOfCargo: typeOfCargo,
      statisticNum: statisticNum,
      grossWeight: grossWeight,
      volume: volume,
      instructions: instructions,
      deals: deals,
      provisions: provisions,
      expensesSender: expensesSender,
      expensesCurrency: expensesCurrency,
      expensesReciever: expensesReciever,
      residueSender: residueSender,
      residueCurrency: residueCurrency,
      residueReciever: residueReciever,
      totalSender: totalSender,
      totalCurrency: totalCurrency,
      totalReciever: totalReciever,
      turned: turned,
      company: company,
      signatureSender: signatureSender,
      signatureTransporter: signatureTransporter,
      signatureReciever: signatureReciever,
      signupId: signupId
    }
    this.http.post(BACKEND_URL + "addCMR/", cmr).subscribe(
      (result :any) => {
        console.log(result.cmr.id);
        this.router.navigate(["/showCMR"], { queryParams: { cmrId: result.cmr.id}});
      }
    );
  }

  getFullCMRData(cmrId: string) {
    return this.http.get<{
      sender: string;
      intList: string;
      reciever: string;
      transporter: string;
      otherTransporters: string;
      placeOfDelivery: string;
      placeAndDateOfPickUp: string;
      remarks: string;
      accompanyingLists: string;
      label: string;
      parcelNum: string;
      typeOfPackaging: string;
      typeOfCargo: string;
      statisticNum: string;
      grossWeight: string;
      volume: string;
      instructions: string;
      deals: string;
      provisions: string;
      expensesSender: string;
      expensesCurrency: string;
      expensesReciever: string;
      residueSender: string;
      residueCurrency: string;
      residueReciever: string;
      totalSender: string;
      totalCurrency: string;
      totalReciever: string;
      turned: string;
      company: string;
      signatureSender: string;
      signatureTransporter: string;
      signatureReciever: string;
      signupId: string;
    }>(BACKEND_URL + "getCMRById/" + cmrId);
  }

  updateCargo(id: string, title: string, description: string) {
    let cargoData: Cargo | FormData;
    cargoData = new FormData();
    cargoData.append("id", id);
    cargoData.append("title", title);
    cargoData.append("description", description);
    this.http
      .put(BACKEND_URL + id, cargoData)
      .subscribe(response => {
        this.router.navigate(["/listCargos"]);
      });
  }

  deleteCargo(cargoId: string) {
    return this.http.delete(BACKEND_URL + cargoId);
  }

  getTrucksByUserId(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL_2 + "getTrucksByUserId/" + userId);
  }

  signupForCargo(cargoId: string, truckId: string) {
    const signupForCargo: CargoSignup = {
      cargoId: cargoId,
      truckId: truckId,
      approved: false,
      finished: false
    }
    this.http
      .post(BACKEND_URL_3 + "addSignup/" , signupForCargo)
      .subscribe(response => {
        window.location.reload();
      });
  }

  getCargosByUserId() {
    this.http
      .get<{ message: string; cargos: any; }>(
        BACKEND_URL + "getCargosByUserId/"
      )
      .pipe(
        map(cargoData => {
          return {
            cargos: cargoData.cargos.map(cargo => {
              return {
                id: cargo._id,
                description: cargo.description,
                cargoType: cargo.cargoType,
                price: cargo.price,
                height: cargo.height,
                width: cargo.width,
                clength: cargo.clength,
                weight: cargo.weight,
                date: cargo.date,
                userId: cargo.userId,
                loads: cargo.loads,
                unLoads: cargo.unLoads,
                signUps: cargo.signUps
              };
            })
          };
        })
      )
      .subscribe(transformedCargoData => {
        this.cargos = transformedCargoData.cargos;
        this.cargosUpdated2.next({
          cargos: [...this.cargos]
        });
      });
  }

  chooseTransporter(signupId: string) {
    const chooseTransporter: ChooseTransporter = {
      approved: true
    }
    this.http
      .put(BACKEND_URL + "chooseTransporter/" + signupId , chooseTransporter)
      .subscribe(response => {
        window.location.reload();
      });
  }

  getTruckRulesByUserId(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL_2 + "getTrucksByUserId/" + userId);
  }
}
