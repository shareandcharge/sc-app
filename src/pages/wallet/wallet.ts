import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController, AlertController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {WalletOptionsPage} from './options/wallet-options';
import {PaymentService} from "../../services/payment.service";
import {AuthService} from "../../services/auth.service";
import {EditProfilePage} from "../profile/edit-profile/edit-profile";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any;
    paymentHistory: any;
    noTransaction = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private paymentService: PaymentService, private authService: AuthService, private alertCtrl: AlertController) {
    }

    ionViewWillEnter() {
        this.getHistory();
        this.getBalance();
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

    walletOptions(e) {
        let popover = this.popoverCtrl.create(WalletOptionsPage);
        popover.present({
            ev: e
        });
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
        let userProfile = this.authService.getUser().profile;

        return !(userProfile.firstname === '' ||
        userProfile.lastname === '' ||
        userProfile.address === '' ||
        userProfile.country === '' ||
        userProfile.postalCode === '' ||
        userProfile.city === '');
    }
}
