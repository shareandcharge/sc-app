import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {PaymentService} from "../../../services/payment.service";
import {PaymentProviderScreenPage} from "./payment-provider-screen/payment-provider-screen";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    user: User;

    payInObject = {};

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private authService: AuthService, private paymenrService: PaymentService) {
        this.user = this.authService.getUser();

        this.payInObject = {
            'type' : 'paypal',
            'amount' : 0,
            'details' : {
                'success_url' : 'http://www.google.de'
            }
        }
    }

    ionViewDidLoad() {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addMoney() {
        this.paymenrService.payIn(this.payInObject).subscribe((response) => {
            if (response.client_action === 'redirect') {
                let redirectUrl = response.action_data.url;
                this.navCtrl.push(PaymentProviderScreenPage, {
                    'pspUrl' : redirectUrl
                });
            }
        })
    }

}
