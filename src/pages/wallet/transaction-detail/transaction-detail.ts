import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";

@Component({
    templateUrl: 'transaction-detail.html',
    selector: 'transaction-detail'
})
export class TransactionDetailPage {
    transaction: any;

    constructor(private navParams: NavParams, private navCtrl: NavController) {
        this.transaction = this.navParams.get('transaction');

        console.log(this.transaction);
    }

    dismiss() {
        this.navCtrl.pop();
    }
}