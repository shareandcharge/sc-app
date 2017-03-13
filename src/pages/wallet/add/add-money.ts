import {Component} from '@angular/core';
import {NavController, ViewController, Events} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";
import {InAppBrowser} from "ionic-native";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {TrackerService} from "../../../services/tracker.service";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    displayAmount: any;
    payInObject: any;

    user: User;

    payInButtonDisabled = false;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService,
                private errorService: ErrorService, private events: Events, private authService: AuthService,
                private trackerService: TrackerService) {
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

    ionViewWillEnter() {
        this.loadUser();
        this.trackerService.track('Started Loading Account', {
            'Screen Name': 'Konto'
        });
    }

    loadUser() {
        this.user = this.authService.getUser();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addMoney() {
        this.payInButtonDisabled = true;
        this.payInObject.amount = this.convertToDecimal(this.displayAmount) * 100;
        this.payInObject.details.cardId = this.user.getCardId();

        this.trackerService.track('Account Info Added', {
            'Payment method': this.payInObject.type,
            'Timestamp': ''
        });

        this.paymentService.payIn(this.payInObject).subscribe(
            (response) => {
                if (response.client_action === 'redirect') {
                    this.showExternalPaymentScreen(response.action_data.url).then(() => {
                        this.dismiss();
                        //-- reload the user, we may have credit card IDs we need to sent next time
                        this.events.publish('auth:refresh:user');
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
            let browser = new InAppBrowser(redirectUrl, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no,hardwareback=no');

            return new Promise((resolve, reject) => {
                browser.on('exit').subscribe(() => resolve());
            });
        }

    }

    convertToDecimal(input: string) {
        return parseFloat(input.replace(',', '.'));
    }
}
