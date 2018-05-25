import {Component} from '@angular/core';
import {NavController, ModalController, AlertController, Events, ToastController} from 'ionic-angular';
import {AddMoneyPage} from './add/add-money';
import {PaymentService} from "../../services/payment.service";
import {AuthService} from "../../services/auth.service";
import {EditProfilePage} from "../profile/profile-data/edit-profile/edit-profile";
// import {TransactionDetailPage} from "./transaction-detail/transaction-detail";
import {ErrorService} from "../../services/error.service";
import {PayOutPage} from "./pay-out/pay-out";
import {VoucherPage} from "./voucher/voucher";
import {Transaction} from "../../models/transaction";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyService} from "../../services/currency.service";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {

    currentBalance: any = 0;
    transactions: Array<Transaction>;
    pendingTransactions: Array<any>;
    intervals = [];
    pollPendingTimeout: number = 6000;  //-- milliseconds to poll for pending transactions
    currency: any = "";
    showPayIn: boolean = true;
    showPayOut: boolean = true;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController,
                private paymentService: PaymentService, private authService: AuthService,
                private alertCtrl: AlertController, private events: Events, private toastCtrl: ToastController,
                private errorService: ErrorService, private translateService: TranslateService, private currencyService: CurrencyService) {
        this.events.subscribe('history:update', () => {
            this.displayToast();
            this.refreshData();
        });

        this.events.subscribe('auth:logout', () => {
            this.clearAllIntervals();
        });

        this.currency = this.currencyService.getCurrency();
        this.showPayIn = this.currencyService.isPayInAvailable();
        this.showPayOut = this.currencyService.isPayOutAvailable();
      }

    ionViewWillEnter() {
        this.refreshData();
    }

    refreshData() {
        this.getHistory();
        this.getBalance();
    }

    clearAllIntervals() {
        while (this.intervals.length) {
            let interval = this.intervals.pop();
            clearInterval(interval);
        }
    }

    getHistory() {
        this.clearAllIntervals();

        let observable = this.paymentService.getHistory();
        observable.subscribe((history) => {
                this.transactions = history;
                this.transactions = this.transactions.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
                this.pendingTransactions = [];

                this.transactions.forEach((transaction) => {
                    if (transaction.isPending()) {
                        this.pendingTransactions.push(transaction);
                    }
                });

                if (this.pendingTransactions.length > 0) {
                    this.startPollingPendingTransactions();
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_wallet_history'));

        return observable;
    }

    getBalance() {
        let observable = this.paymentService.getBalance();
        observable.subscribe((balance) => {
                this.currentBalance = balance;
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_wallet_balance'));

        return observable;
    }

    addMoney() {
        if (!this.checkProfileComplete() || !this.showPayIn) return;

        let modal = this.modalCtrl.create(AddMoneyPage);
        modal.onDidDismiss(data => {
            this.refreshData();
        });
        modal.present();
    }

    checkProfileComplete() {
        if (this.profileComplete()) return true;

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('wallet.incomplete_data'),
            message: this.translateService.instant('wallet.msg_complete_profile'),
            buttons: [
                {
                    text: this.translateService.instant('common.ok'),
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

    /**
     * Intervals should already be cleared
     */
    startPollingPendingTransactions() {
        /**
         * if we have one pending voucher, we setup _one_ timer to refresh everything;
         * because we can't request/check the status of a single voucher.
         */
        let haveTimeout = false;
        this.pendingTransactions.some((transaction) => {
            if (transaction.isVoucher() && transaction.isPending()) {
                setTimeout(() => this.refreshData(), this.pollPendingTimeout);
                haveTimeout = true;
                return true;
            }
            return false;
        });

        if (haveTimeout) return;

        /**
         * setup one timer/check for each pending transaction
         */
        this.pendingTransactions.forEach((transaction, idx) => {
            if (!transaction.hasOrder()) return;

            let orderId = transaction.order.id;
            let timeout = this.pollPendingTimeout + (idx * 500);    // spread the requests a bit

            this.intervals.push(
                setInterval(() => this.checkForUpdate(transaction.order.tokenstatus, orderId), timeout)
            );
        })
    }

    checkForUpdate(oldStatus, orderId) {
        this.paymentService.getPaymentStatus(orderId).subscribe((res) => {
            if (res.tokenstatus !== oldStatus) {
                this.events.publish('history:update');
            }
        });
    }

    displayToast() {
        let messageTrans = this.translateService.instant("toast.wallet_transaction_successful");

        let toast = this.toastCtrl.create({
            message: messageTrans,
            duration: 3000
        });
        toast.present();
    }

    openTransactionDetail(transaction) {
        // let modal = this.modalCtrl.create(TransactionDetailPage, {
        //     'transaction': transaction,
        //     'wallet' : this
        // });
        // modal.present();
    }

    payOut() {
        let modal = this.modalCtrl.create(PayOutPage);
        modal.present();
        modal.onDidDismiss(() => this.refreshData());
    }

    redeemVoucher() {
        let modal = this.modalCtrl.create(VoucherPage);
        modal.present();
        modal.onDidDismiss(() => this.refreshData());
    }

    getIcon(transaction: Transaction): string {
        switch (true) {
            case transaction.isReceived():
                return 'cust-station';
            case transaction.isSend():
                return 'cust-charged-car';
            case transaction.isVoucher():
                return 'cust-voucher';
            case transaction.isPayOut():
                return 'cust-withdraw';
            case transaction.isPayIn():
                switch (transaction.order.type) {
                    case 'cc':
                        return 'cust-credit-card';
                    case 'dd':
                        return 'cust-debit';
                    case 'paypal':
                        return 'cust-paypal';
                }
        }
    }
}
