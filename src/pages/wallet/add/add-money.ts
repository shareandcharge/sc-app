import {Component} from '@angular/core';
import {NavController, ViewController, Events} from 'ionic-angular';
import {PaymentService} from "../../../services/payment.service";
import {ErrorService} from "../../../services/error.service";
import {InAppBrowser} from "ionic-native";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyService} from "../../../services/currency.service";

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    displayAmount: any;
    payInObject: any;
    cardId: string;

    user: User;

    payInButtonDisabled = false;

    currency: any = "";
    showPaypal: boolean = true;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private paymentService: PaymentService,
                private errorService: ErrorService, private events: Events, private authService: AuthService,
                private trackerService: TrackerService, private translateService: TranslateService, private currencyService: CurrencyService) {
        this.payInObject = {
            'type': 'cc',
            'amount': 0,
            'details': {
                'success_url': '',
                'error_url': '',
                'iban': '',
                'bic': '',
                'account_holder': ''
            }
        }
        this.currency = this.currencyService.getCurrency();
        this.showPaypal = this.currencyService.isPaypalAvailable();
    }

    ionViewWillEnter() {
        this.loadUser();
        if (this.user.hasCreditCards()) {
            //-- preset with first credit card
            this.cardId = this.user.getCreditCards()[0].id;
        }

        let screenName = this.translateService.instant('add_money.account');
        this.trackerService.track('Started Loading Account', {
            'Screen Name': screenName
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
        this.payInObject.details.cardId = this.cardId;

        const language = this.translateService.currentLang;
        this.payInObject.details.success_url = `https://api-test.shareandcharge.com/v1/wallet/feedback/${language}/success.html`
        this.payInObject.details.error_url = `https://api-test.shareandcharge.com/v1/wallet/feedback/${language}/error.html`


        this.trackerService.track('Account Info Added', {
            'Payment method': this.payInObject.type,
            'Timestamp': ''
        });

        this.paymentService.payIn(this.payInObject).subscribe(
            (response) => {
                if (response.client_action === 'redirect') {
                    this.showExternalPaymentScreen(response.action_data.url).then(() => {
                        this.dismiss();
                    });
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.wallet_payin')
        );
    }

    showExternalPaymentScreen(redirectUrl) {
        if (!(window as any).cordova) {
            window.open(redirectUrl, '_blank', 'presentationstyle=pagesheet');

            return new Promise((resolve, reject) => {
                resolve();
            })
        } else {
            let options = 'presentationstyle=fullscreen,closebuttoncaption=' + this.translateService.instant('common.close') + ',toolbar=yes,location=no,hardwareback=no'
            let browser = new InAppBrowser(redirectUrl, '_blank', options);

            return new Promise((resolve, reject) => {
                browser.on('exit').subscribe(() => {
                    //-- reload the user, we may have credit card IDs we need to sent next time
                    this.events.publish('auth:refresh:user');

                    resolve();
                });
            });
        }

    }

    convertToDecimal(input: string) {
        return parseFloat(input.replace(',', '.'));
    }
}
