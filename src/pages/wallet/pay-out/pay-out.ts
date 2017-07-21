import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";
import {FormBuilder, Validators} from "@angular/forms";
import {CurrencyService} from "../../../services/currency.service";

@Component({
    selector: 'pay-out',
    templateUrl: 'pay-out.html'
})
export class PayOutPage {

    submitAttempt: boolean = false;
    payOutObject: any;
    displayAmount: any;
    form: any;

    currency: any = "";

    constructor(private viewCtrl: ViewController, private paymentService: PaymentService, private errorService: ErrorService,
                private formBuilder: FormBuilder, private currencyService: CurrencyService) {
        this.payOutObject = {
            bic: '',
            iban: '',
            password: '',
            amount: 0
        };

        this.form = this.formBuilder.group({
            amount: [null, Validators.compose([Validators.required])],
            bic: [null, Validators.compose([Validators.required])],
            iban: [null, Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });

        this.currency = this.currencyService.getCurrency();
    }

    payOut() {
        this.submitAttempt = true;

        if (!this.form.valid) {
            return;
        }

        this.payOutObject.amount = this.convertToDecimal(this.displayAmount) * 100;
        this.paymentService.payOut(this.payOutObject).subscribe((res) => {
            this.viewCtrl.dismiss();
        }, (error) => {
            this.errorService.displayErrorWithKey(error, 'error.scope.wallet_payout');
        });
    }

    convertToDecimal(input: string) {
        return parseFloat(input.replace(',', '.'));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
