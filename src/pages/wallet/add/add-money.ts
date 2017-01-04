import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-add-money',
    templateUrl: 'add-money.html'
})
export class AddMoneyPage {
    amount: any;
    paymentMethod: string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController) {
        this.paymentMethod = 'paypal';
    }

    ionViewDidLoad() {
    }

    dismiss() {
        this.viewCtrl.dismiss(this.amount);
    }

    addMoney() {
    }

}
