import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'voucher-page',
    templateUrl: 'voucher.html'
})
export class VoucherPage {
    voucherCode: string;
    redeemSuccess = false;
    redeemError = false;
    errorMessage: string;

    voucherErrors = ['api_error.invalid_voucher', 'api_error.used_voucher', 'api_error.expired_voucher', 'api_error.no_voucheraccount', 'api_error.voucher_balance_too_low'];

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService, private errorService: ErrorService, private translateService: TranslateService) {

    }

    redeemVoucher() {
        this.paymentService.redeemVoucher(this.voucherCode).subscribe((res) => {
            console.log("success", res);
            this.redeemSuccess = true;
        }, (error) => {
            console.log("error", error);
            let key = this.errorService.getMessage(error);

            if (this.voucherErrors.indexOf(key) >= 0) {
                this.translateService.get(key).subscribe(value => {
                    this.errorMessage = value;
                    this.redeemError = true;
                });
            } else {
                this.errorService.displayErrorWithKey(error, 'Gutschein einlösen');
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
