import {Component} from '@angular/core';
import {NavController, ModalController, AlertController, Events, ToastController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {PaymentService} from "../../services/payment.service";
import {AuthService} from "../../services/auth.service";
import {EditProfilePage} from "../profile/edit-profile/edit-profile";
import {Observable} from "rxjs";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any = 0;
    paymentHistory: any;
    noTransaction = true;
    pendingTransactions: Array<any>;
    intervals = [];

    TRANSACTION_TYPES = {
        SUCCESS : 'TokenUpdate',
        PENDING : 'TokenUpdate-pending',
        RECEIVED : 'Received',
        SEND : 'Send'
    };

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private paymentService: PaymentService, private authService: AuthService, private alertCtrl: AlertController, private events: Events, private toastCtrl: ToastController) {
        this.events.subscribe('history:update', () => {
            this.displayToast();
            this.refreshData();
        });

        this.events.subscribe('auth:logout', () => {
            this.clearAllIntervals();
        });
    }

    ionViewWillEnter() {
        this.refreshData();
    }

    refreshData() {
        this.clearAllIntervals();
        this.getHistory();
        this.getBalance();
    }

    clearAllIntervals() {
        while(this.intervals.length) {
            let interval = this.intervals.pop();
            clearInterval(interval);
        }
    }

    getHistory() {
        let observable = this.paymentService.getHistory();
        observable.subscribe((history) => {
            this.paymentHistory = history;

            if (typeof this.paymentHistory !== 'undefined') {
                if (this.paymentHistory.length > 0) {
                    this.noTransaction = false;
                    this.pendingTransactions = [];

                    this.paymentHistory.forEach((transaction) => {
                        if (transaction.type === this.TRANSACTION_TYPES.PENDING) {
                            this.pendingTransactions.push(transaction);
                        }
                    });

                    if (this.pendingTransactions.length > 0) {
                        this.pollPendingTransactions();
                    }
                }
            }
        });

        return observable;
    }

    getBalance() {
        let observable = this.paymentService.getBalance();
        observable.subscribe((balance) => {
            this.currentBalance = balance;
        });

        return observable;
    }

    addMoney() {
        if (!this.checkProfileComplete()) return;

        let modal = this.modalCtrl.create(AddMoneyPage);
        modal.onDidDismiss(data => {
            this.refreshData();
        });
        modal.present();
    }

    checkProfileComplete() {
        if (this.profileComplete()) return true;

        let alert = this.alertCtrl.create({
            title: 'Daten unvollständig',
            message: 'Um Zahlungsvorgänge durchführen zu können musst Du zunächst Dein Profil vervollständigen.',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.navCtrl.push(EditProfilePage, {
                            'user': this.authService.getUser()
                        });
                    }
                }
            ]
        });

        alert.present();

        return false;
    }

    profileComplete() {
        return this.authService.getUser().isProfileComplete();
    }

    doRefresh(refresher) {
        this.getHistory().subscribe(() => {
            this.getBalance().subscribe(() => {
                refresher.complete();
            })
        })
    }

    pollPendingTransactions() {
        this.pendingTransactions.forEach((transaction) => {
            let orderId = transaction.order.id;
            this.intervals.push(setInterval(() => this.checkForUpdate(orderId), 3000));
        })
    }

    checkForUpdate(orderId) {
        this.paymentService.getPaymentStatus(orderId).subscribe((res) => {
            if (res.tokenstatus === 'createToken') {
                this.events.publish('history:update');
            }
        });
    }

    displayToast() {
        let toast = this.toastCtrl.create({
            message : 'Transaktion erfolgreich durchgeführt.',
            duration: 3000
        });
        toast.present();
    }
}
