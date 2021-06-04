import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { CargosService } from "../../cargo.service";
import { Subscription } from "rxjs";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./cmr-create.component.html",
  styleUrls: ["./cmr-create.component.css"]
})
export class CMRCreateComponent implements OnInit, OnDestroy {

  isLoading = false;
  submitted = false;
  CMRForm: FormGroup;
  private authStatusSub: Subscription;
  cmrData;
  signupId = '';
  sCompanyName = '';
  sCity = '';
  sAddress = '';
  sCountry = '';
  sPostalCode = '';

  constructor(private router: Router, public cargoService: CargosService, private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.CMRForm = new FormGroup({
      sender: new FormControl(),
      intList: new FormControl(),
      reciever: new FormControl(),
      transporter: new FormControl(),
      otherTransporters: new FormControl(),
      placeOfDelivery: new FormControl(),
      placeAndDateOfPickUp: new FormControl(),
      remarks: new FormControl(),
      accompanyingLists: new FormControl(),
      label: new FormControl(),
      parcelNum: new FormControl(),
      typeOfPackaging: new FormControl(),
      typeOfCargo: new FormControl(),
      statisticNum: new FormControl(),
      grossWeight: new FormControl(),
      volume: new FormControl(),
      instructions: new FormControl(),
      deals: new FormControl(),
      provisions: new FormControl(),
      expensesSender: new FormControl(),
      expensesCurrency: new FormControl(),
      expensesReciever: new FormControl(),
      residueSender: new FormControl(),
      residueCurrency: new FormControl(),
      residueReciever: new FormControl(),
      totalSender: new FormControl(),
      totalCurrency: new FormControl(),
      totalReciever: new FormControl(),
      turned: new FormControl(),
      company: new FormControl(),
      signatureSender: new FormControl(),
      signatureTransporter: new FormControl(),
      signatureReciever: new FormControl(),
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.signupId = params['signupId'];
    });
  }

  ngOnInit() {
    this.authService.getUser(this.authService.getUserId()).subscribe(result => {
      this.sCompanyName = result.companyName;
      this.sAddress = result.address;
      this.sCity = result.city;
      this.sCountry = result.country;
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
      this.isLoading = true;
      this.cargoService.getCMRData(this.signupId).subscribe(data => {
        this.isLoading = false;
        this.cmrData = {
          id: data[0]._id,
          userId: data[0].userId,
          cargoId: data[0].cargoId,
          truckId: data[0].truckId,
          approved: data[0].approved,
          finished: data[0].finished,
          truck: data[0].truck,
          cargo: data[0].cargo,
          user: data[0].user
        };
        this.CMRForm.setValue({
          sender:
            this.sCompanyName + ", " +
            this.sAddress + ", " +
            this.sPostalCode + " " +
            this.sCity + ", " +
            this.sCountry,
          intList: '',
          reciever: '',
          transporter:
            this.cmrData.user[0].companyName + ", " +
            this.cmrData.user[0].address + ", " +
            this.cmrData.user[0].city + ", " +
            this.cmrData.user[0].country,
          otherTransporters: '',
          placeOfDelivery:
            this.cmrData.cargo[0].unload[0].address + ", " +
            this.cmrData.cargo[0].unload[0].city + ", " +
            this.cmrData.cargo[0].unload[0].countryCode,
          placeAndDateOfPickUp: '',
          remarks: '',
          accompanyingLists: '',
          label: '',
          parcelNum: '',
          typeOfPackaging: '',
          typeOfCargo: '',
          statisticNum: '',
          grossWeight: '',
          volume: '',
          instructions: '',
          deals: '',
          provisions: '',
          expensesSender: '',
          expensesCurrency: '',
          expensesReciever: '',
          residueSender: '',
          residueCurrency: '',
          residueReciever: '',
          totalSender: '',
          totalCurrency: '',
          totalReciever: '',
          turned: '',
          company: '',
          signatureSender: '',
          signatureTransporter: '',
          signatureReciever: ''
        });
      });
  }

  onSaveCMR() {
    this.submitted = true;
    if (this.CMRForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.cargoService.addCMR(
      this.CMRForm.value.sender,
      this.CMRForm.value.intList,
      this.CMRForm.value.reciever,
      this.CMRForm.value.transporter,
      this.CMRForm.value.otherTransporters,
      this.CMRForm.value.placeOfDelivery,
      this.CMRForm.value.placeAndDateOfPickup,
      this.CMRForm.value.remarks,
      this.CMRForm.value.accompanyingLists,
      this.CMRForm.value.label,
      this.CMRForm.value.parcelNum,
      this.CMRForm.value.typeOfPackaging,
      this.CMRForm.value.typeOfCargo,
      this.CMRForm.value.statisticNum,
      this.CMRForm.value.grossWeight,
      this.CMRForm.value.volume,
      this.CMRForm.value.instructions,
      this.CMRForm.value.deals,
      this.CMRForm.value.provisions,
      this.CMRForm.value.expensesSender,
      this.CMRForm.value.expensesCurrency,
      this.CMRForm.value.expensesReciever,
      this.CMRForm.value.residueSender,
      this.CMRForm.value.residueCurrency,
      this.CMRForm.value.residueReciever,
      this.CMRForm.value.totalSender,
      this.CMRForm.value.totalCurrency,
      this.CMRForm.value.totalReciever,
      this.CMRForm.value.turned,
      this.CMRForm.value.company,
      this.CMRForm.value.signatureSender,
      this.CMRForm.value.signatureTransporter,
      this.CMRForm.value.signatureReciever,
      this.signupId
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
