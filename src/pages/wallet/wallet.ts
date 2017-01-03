import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {WalletOptionsPage} from './options/wallet-options';
import {PaymentService} from "../../services/payment.service";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any;
    paymentHistory: any;
    hasMoney = false;
    noTransaction = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private paymentService: PaymentService) {
        this.currentBalance = "32,00";

        if (typeof this.currentBalance != 'undefined') {
            this.hasMoney = true;
        }

        this.getHistory();
        this.getBalance();
    }

    ionViewDidLoad() {
        //console.log('Hello WalletPage Page');
    }

    getHistory() {
        this.paymentService.getHistory().subscribe((history) => {
            this.paymentHistory = history;

            if (typeof this.paymentHistory != 'undefined') {
                if (this.paymentHistory.length > 0) {
                    this.noTransaction = false;
                }
            }
        });
    }

    getBalance() {
        this.paymentService.getBalance().subscribe((balance) => {
            this.currentBalance = balance;
        });
    }

    addMoney() {
        console.log("form the money");
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
