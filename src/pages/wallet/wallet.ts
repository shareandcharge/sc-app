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
    hasMoney = false;
    noTransaction = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private paymentService: PaymentService, private authService: AuthService, private alertCtrl: AlertController) {
        this.currentBalance = "32,00";

        if (typeof this.currentBalance != 'undefined') {
            this.hasMoney = true;
        }

        this.getHistory();
        this.getBalance();
    }

    ionViewWillEnter() {
        let currentUser = this.authService.getUser();
        let userProfile = currentUser.profile;

        if (userProfile.firstname === '' ||
            userProfile.lastname === '' ||
            userProfile.address === '' ||
            userProfile.country === '' ||
            userProfile.postalCode === '' ||
            userProfile.city === '') {

            let alert = this.alertCtrl.create({
                title: 'Daten unvollständig',
                message: 'Um auf dein Wallet zugreifen zu können musst du zunächst dein Profil vervollständigen',
                buttons: [
                    {
                        text: 'Ok',
                        handler : () => {
                            this.navCtrl.push(EditProfilePage, {
                                'user' : currentUser
                            });
                        }
                    }
                ]
            });

            alert.present();
        }
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
