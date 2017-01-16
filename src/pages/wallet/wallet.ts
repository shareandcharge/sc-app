import {Component} from '@angular/core';
import {NavController, ModalController, AlertController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {PaymentService} from "../../services/payment.service";
import {AuthService} from "../../services/auth.service";
import {EditProfilePage} from "../profile/edit-profile/edit-profile";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any = 0;
    paymentHistory: any;
    noTransaction = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private paymentService: PaymentService, private authService: AuthService, private alertCtrl: AlertController) {
    }

    ionViewWillEnter() {
        this.getHistory();
        this.getBalance();
    }

    getHistory() {
        let observable = this.paymentService.getHistory();
        observable.subscribe((history) => {
            this.paymentHistory = history;

            if (typeof this.paymentHistory != 'undefined') {
                if (this.paymentHistory.length > 0) {
                    this.noTransaction = false;
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
            if (parseFloat(data)) {
                let balance;
                balance = parseFloat(this.currentBalance) + parseFloat(data);
                this.currentBalance = balance;
            }
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
}
