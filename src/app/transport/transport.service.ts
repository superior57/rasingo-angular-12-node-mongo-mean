import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Transport } from "./transport.model";

const BACKEND_URL = environment.apiUrl + "/transports/";
const BACKEND_URL_2 = environment.apiUrl + "/trucks/";

@Injectable({ providedIn: "root" })
export class TransportService {

  private transports: Transport[] = [];
  private transportsUpdated = new Subject<{ transports: Transport[]; transportCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  addTransport(date: string, no: number, placekg: string, start: string, destination: string, description: string, truckId: string) {
    const transport: Transport  = {
    date: date,
    no: no,
    placekg: placekg,
    start: start,
    destination: destination,
    description: description,
    truckId: truckId
    }
    this.http.post(BACKEND_URL + "addTransport/", transport).subscribe(
      () => {
        this.router.navigate(["/"]);
      }
    );
  }

  getTransportUpdateListener() {
    return this.transportsUpdated.asObservable();
  }

  getTransports(transportsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${transportsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; transports: any; maxTransports: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(transportData => {
          return {
            transports: transportData.transports.map(transport => {
              return {
                no: transport.no,
                placekg: transport.placekg,
                start: transport.start,
                destination: transport.destination,
                description: transport.description,
                truck: transport.truck,
                id: transport._id,
              };
            }),
            maxTransports: transportData.maxTransports
          };
        })
      )
      .subscribe(transformedTransportData => {
        this.transports = transformedTransportData.transports;
        this.transportsUpdated.next({
          transports: [...this.transports],
          transportCount: transformedTransportData.maxTransports
        });
      });
  }

  getTrucksByUserId(userId: string):Observable<any>  {
    return this.http.get(BACKEND_URL_2 + "getTrucksByUserId/" + userId);
  }
}
