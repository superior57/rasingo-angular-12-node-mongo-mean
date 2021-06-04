import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { CargosService } from "../../cargo.service";
import { Subscription } from "rxjs";
import { AuthService } from "../../../auth/auth.service";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: "app-start-page",
  templateUrl: "./show-cmr.component.html",
  styleUrls: ["./show-cmr.component.css"]
})
export class ShowCMRComponent implements OnInit, OnDestroy {

  isLoading = false;
  submitted = false;
  CMRForm: FormGroup;
  private authStatusSub: Subscription;
  fullCmrData;
  cmrId = '';

  constructor(private router: Router, public cargoService: CargosService, private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.cmrId = params['cmrId'];
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.cargoService.getFullCMRData(this.cmrId).subscribe(data => {
      this.isLoading = false;
      this.fullCmrData = {
        sender: data[0].sender,
        intList: data[0].intList,
        reciever: data[0].reciever,
        transporter: data[0].transporter,
        otherTransporters: data[0].otherTransporters,
        placeOfDelivery: data[0].placeOfDelivery,
        placeAndDateOfPickUp: data[0].placeAndDateOfPickUp,
        remarks: data[0].remarks,
        accompanyingLists: data[0].accompanyingLists,
        label: data[0].label,
        parcelNum: data[0].parcelNum,
        typeOfPackaging: data[0].typeOfPackaging,
        typeOfCargo: data[0].typeOfCargo,
        statisticNum: data[0].statisticNum,
        grossWeight: data[0].grossWeight,
        volume: data[0].volume,
        instructions: data[0].instructions,
        deals: data[0].deals,
        provisions: data[0].provisions,
        expensesSender: data[0].expensesSender,
        expensesCurrency: data[0].expensesCurrency,
        expensesReciever: data[0].expensesReciever,
        residueSender: data[0].residueSender,
        residueCurrency: data[0].residueCurrency,
        residueReciever: data[0].residueReciever,
        totalSender: data[0].totalSender,
        totalCurrency: data[0].totalCurrency,
        totalReciever: data[0].totalReciever,
        turned: data[0].turned,
        company: data[0].company,
        signatureSender: data[0].signatureSender,
        signatureTransporter: data[0].signatureTransporter,
        signatureReciever: data[0].signatureReciever,
        signupId: data[0].signupId
      };
    });

  }

  generatePDF() {
    const html_source = document.getElementById('table-data');   // Get html

    html2canvas(html_source).then(function(canvas) { // Convert to canvas
      let fileWidth = 208;
    let fileHeight = canvas.height * fileWidth / canvas.width;

   let imgData = canvas.toDataURL('image/png'); // Generates image that you can store

   let pdf = new jsPDF('p', 'mm', 'a4'); //Create PDF, Note that you use the same image to create the PDF
   pdf.addImage(imgData, 'PNG', 0, 0, fileWidth, fileHeight);
   pdf.save('test.pdf');
 })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
