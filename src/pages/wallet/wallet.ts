import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {WalletOptionsPage} from './options/wallet-options';

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any;
    paymentHistory: any;
    hasMoney = false;
    noTransaction = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
        this.currentBalance = "32,00";
        this.paymentHistory = [
            {
                "type": "+",
                "amount": "18.2",
                "date": new Date(),
            },
            {
                "type": "-",
                "amount": "28.2",
                "date": new Date(),
            },
            {
                "type": "+",
                "amount": "48.2",
                "date": new Date(),
            }
        ];

        if (typeof this.currentBalance != 'undefined') {
            this.hasMoney = true;
        }

        if (typeof this.paymentHistory != 'undefined') {
            if (this.paymentHistory.length > 0) {
                this.noTransaction = false;
            }
        }

    }

    ionViewDidLoad() {
        //console.log('Hello WalletPage Page');
    }

    addMoney() {
        console.log("add the money");
        let modal = this.modalCtrl.create(AddMoneyPage);
        modal.onDidDismiss(data => {
            if(parseFloat(data)){
                let balance;
                balance = parseFloat(this.currentBalance) + parseFloat(data);
                this.currentBalance = balance;
            }
        });
        modal.present();
    }

    deleteTransaction(tr) {
        console.log("delete ", tr);
    }

    walletOptions(e) {

        let popover = this.popoverCtrl.create(WalletOptionsPage);
        popover.present({
            ev: e
        });
    }
}
