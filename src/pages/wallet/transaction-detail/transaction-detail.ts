import {Component} from "@angular/core";
import {NavParams, NavController, Platform} from "ionic-angular";
import {CurrencyPipe} from "@angular/common";
import {InAppBrowser} from "ionic-native";
import {Transaction} from "../../../models/transaction";
import {TranslateService} from "@ngx-translate/core";


@Component({
    templateUrl: 'transaction-detail.html',
    selector: 'transaction-detail'
})
export class TransactionDetailPage {
    transaction: Transaction;

    priceProviderTariffTypes = [
        'disabled',
        'Flatrate',
        'Stundentarif',
        'kWh-Tarif'
    ];

    paymentMethods = {
        'cc': this.translateService.instant('add_money.credit_card'),
        'paypal': this.translateService.instant('add_money.paypal'),
        'dd': this.translateService.instant('add_money.direct_debit'),
        'sofort':  this.translateService.instant('add_money.direct'),
    };

    constructor(private navParams: NavParams, private navCtrl: NavController, private platform: Platform, private translateService: TranslateService) {
        this.transaction = this.navParams.get('transaction');
    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        return h + 'h ' + m + 'm ' + s + 's';
    }

    dismiss() {
        this.navCtrl.pop();
    }

    getTariffCosts(contracttype: number): string {
        switch (contracttype) {
            case 0: {
                return '';
            }
            case 1: {
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperhour / 100, 'EUR', true, '1.2-2');
            }
            case 2: {
                //-- @TODO see https://github.com/slockit/sc-app/issues/342
                // need to change that to use locationService.getEstimatedPrice
                // it's ok for innog stations, now
                // return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperkw / 100, 'EUR', true, '1.2-2') + '/kWh';
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperhour / 100, 'EUR', true, '1.2-2') + '/h';
            }
            case 3: {
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperkw / 100, 'EUR', true, '1.2-2') + '/kWh';
            }
        }
    }

    openPdf(url) {
        /**
         * There's no easy way to display a pdf on android.
         * No build in capability in browser; safari there is.
         * Would be a bigger efford to install (and make work) all plugins needed to display a pdf on android.
         * Not worth it for now. So an andoird we sent the pdf to the default browser an "see what happens".
         */
        let target = this.platform.is('android') ? '_system' : '_blank';
        new InAppBrowser(url, target, 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no,enableViewportScale=yes');
    }

}