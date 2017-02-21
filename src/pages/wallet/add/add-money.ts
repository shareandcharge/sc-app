import {Component} from '@angular/core';
import {NavController, ViewController, ModalController} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";
import {InAppBrowser} from "ionic-native";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    displayAmount: any;
    payInObject: any;

    payInButtonDisabled = false;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService, private errorService: ErrorService, private modalCtrl: ModalController) {
        this.payInObject = {
            'type': 'cc',
            'amount': 0,
            'details': {
                'success_url': 'https://api-test.shareandcharge.com/v1/wallet/feedback/success.html',
                'error_url': 'https://api-test.shareandcharge.com/v1/wallet/feedback/error.html',
                'iban': '',
                'bic': '',
                'account_holder': ''
            }
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addMoney() {
        this.payInButtonDisabled = true;
        this.payInObject.amount = this.convertToDecimal(this.displayAmount) * 100;

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
        if (!(window as any).cordova) {
            window.open(redirectUrl, '_blank', 'presentationstyle=pagesheet');

            return new Promise((resolve, reject) => {
                resolve();
            })
        } else {
            let browser = new InAppBrowser(redirectUrl, '_blank', 'presentationstyle=pagesheet');

            return new Promise((resolve, reject) => {
                browser.on('exit').subscribe(() => resolve());
            });
        }

    }

    convertToDecimal(input: string) {
        return parseFloat(input.replace(',', '.'));
    }
}
