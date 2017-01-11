import {Component} from '@angular/core';
import {NavController, ViewController, ModalController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {PaymentProviderScreenPage} from "./payment-provider-screen/payment-provider-screen";
import {ErrorService} from "../../../services/error.service";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    displayAmount: any;

    payInObject: any;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService, private modalCtrl: ModalController, private errorService: ErrorService) {
        this.payInObject = {
            'type': 'cc',
            'amount': 0,
            'details': {
                'success_url': 'https://api-test.shareandcharge.com/v1/wallet/feedback/success.html',
                'error_url': 'https://api-test.shareandcharge.com/v1/wallet/feedback/error.html'
            }
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addMoney() {
        this.payInObject.amount = this.displayAmount * 100;

        this.paymentService.payIn(this.payInObject).subscribe(
            (response) => {
                if (response.client_action === 'redirect') {
                    this.showExternalPaymentScreen(response.action_data.url).then(() => {
                        this.dismiss();
                    });
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'Konto aufladen')
        );
    }

    showExternalPaymentScreen(redirectUrl) {
        let modal = this.modalCtrl.create(PaymentProviderScreenPage, {
            'pspUrl': redirectUrl
        });

        modal.present();

        return new Promise((resolve, reject) => {
            modal.onDidDismiss(() => resolve());
        });
    }
}
