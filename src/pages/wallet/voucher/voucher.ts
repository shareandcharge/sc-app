import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";

@Component({
    selector: 'voucher-page',
    templateUrl: 'voucher.html'
})
export class VoucherPage {
    voucherCode: string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService, private errorService: ErrorService) {

    }

    redeemVoucher() {
        this.paymentService.redeemVoucher(this.voucherCode).subscribe((res) => {
            console.log(res);
        }, (error) => {
            this.errorService.displayErrorWithKey(error, 'Gutschein einlösen');
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
