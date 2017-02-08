import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {CurrencyPipe} from "@angular/common";

@Component({
    templateUrl: 'transaction-detail.html',
    selector: 'transaction-detail'
})
export class TransactionDetailPage {
    transaction: any;

    priceProviderTariffTypes = [
        'disabled',
        'Flatrate',
        'Stundentarif',
        'kWh-Tarif'
    ];

    paymentMethods = {
        'cc' : 'Kreditkarte',
        'paypal' : 'PayPal',
        'dd' : 'Bankeinzug',
        'sofort' : 'Sofortüberweisung'
    };

    constructor(private navParams: NavParams, private navCtrl: NavController) {
        this.transaction = this.navParams.get('transaction');
    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        let finalString = h + 'h ' + m + 'm ' + s + 's';
        return finalString;
    }

    dismiss() {
        this.navCtrl.pop();
    }

    getTariffCosts(contracttype: number): string {
        switch(contracttype) {
            case 0: {
                return '';
            }
            case 1: {
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperhour / 100, 'EUR', true, '1.2-2');
            }
            case 2: {
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperkw / 100, 'EUR', true, '1.2-2') + '/kWh';
            }
            case 3: {
                return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperkw / 100, 'EUR', true, '1.2-2') + '/kWh';
            }
        }
    }

}