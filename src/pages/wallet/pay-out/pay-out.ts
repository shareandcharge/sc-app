import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";

@Component({
    selector: 'pay-out',
    templateUrl: 'pay-out.html'
})
export class PayOutPage {

    payOutObject: any;
    displayAmount: any;

    constructor(private viewCtrl: ViewController, private paymentService: PaymentService, private errorService: ErrorService) {
        this.payOutObject = {
            bic: '',
            iban: '',
            amount: 0
        };
    }

    payOut() {
        this.payOutObject.amount = this.convertToDecimal(this.displayAmount) * 100;
        this.paymentService.payOut(this.payOutObject).subscribe((res) => {
            this.viewCtrl.dismiss();
        }, (error) => {
            this.errorService.displayErrorWithKey(error, 'Geld auszahlen');
        });
    }

    convertToDecimal(input: string) {
        return parseFloat(input.replace(',', '.'));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
