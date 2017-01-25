import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";

@Component({
    templateUrl: 'transaction-detail.html',
    selector: 'transaction-detail'
})
export class TransactionDetailPage {
    transaction: any;

    transactionInformation = [];


    // TODO: create enum to store the TariffTypes
    priceProviderTariffTypes = [
        'invalid',
        'Flatrate',
        'Stundentarif',
        'kWh-Tarif'
    ];

    constructor(private navParams: NavParams, private navCtrl: NavController) {
        this.transaction = this.navParams.get('transaction');

        console.log(this.transaction);

        this.transactionInformation.push(["Datum", new Date(this.transaction.timestamp)])

        if (this.transaction.order) {
            this.transactionInformation.push(["Amount", this.transaction.amount / 100]);
            this.transactionInformation.push(["Zahlungsart", this.transaction.order.type])
        } else if (this.transaction.receipt) {
            this.transactionInformation.push(["Art der Transaktion", this.transaction.type]);
            this.transactionInformation.push(["Amount", this.transaction.amount / 100]);
            this.transactionInformation.push(["S&C-Gebühren", this.transaction.receipt.feeamount / 100]);
            this.transactionInformation.push(["Geladene Energie", this.transaction.receipt.chargeamount / 1000]);
            this.transactionInformation.push(["Name des Laders", this.transaction.receipt.charger_profile.firstname + " " + this.transaction.receipt.charger_profile.lastname]);
            this.transactionInformation.push(["Tarif", this.priceProviderTariffTypes[this.transaction.receipt.contracttype]]);
        }
    }

    dismiss() {
        this.navCtrl.pop();
    }
}