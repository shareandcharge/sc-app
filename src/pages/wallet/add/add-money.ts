import {Component} from '@angular/core';
import {NavController, ViewController, ModalController} from 'ionic-angular';
import {AuthService} from "../../../services/auth.service";
import {PaymentService} from "../../../services/payment.service";
import {PaymentProviderScreenPage} from "./payment-provider-screen/payment-provider-screen";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    displayAmount: any;

    payInObject: any;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private authService: AuthService, private paymentService: PaymentService, private modalCtrl: ModalController) {
        this.payInObject = {
            'type': 'cc',
            'amount': 0,
            'details': {
                'success_url': 'http://www.delodi.net'
            }
        }
    }

    ionViewWillEnter() {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addMoney() {
        this.payInObject.amount = this.displayAmount * 100;

        this.paymentService.payIn(this.payInObject).subscribe((response) => {
            if (response.client_action === 'redirect') {
                this.showExternalPaymentScreen(response.action_data.url).then(() => {
                    this.dismiss();
                });
            }
        });
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
