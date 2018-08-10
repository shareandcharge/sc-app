import {Component} from "@angular/core";
import {NavParams, NavController, Platform, Events} from "ionic-angular";
import {InAppBrowser} from "ionic-native";
import {Transaction} from "../../../models/transaction";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyDisplay} from "../../../models/currency-display";
import {CurrencyService} from "../../../services/currency.service";
import {WalletPage} from "../wallet";


@Component({
    templateUrl: 'transaction-detail.html',
    selector: 'transaction-detail',
    providers: [CurrencyDisplay]
})
export class TransactionDetailPage {
    transaction: Transaction;
    wallet : WalletPage;

    priceProviderTariffTypes = [
        'disabled',
        'Flatrate',
        'Stundentarif',
        'kWh-Tarif'
    ];

    Tariffs = {
        0: 'ENERGY',
        1: 'FLAT',
        3: 'TIME'
    }

    tariffId: any;
    tariff: any;
    city: string;
    address: string;
    name: string;
    country: string;

    paymentMethods = {
        'cc': this.translateService.instant('add_money.credit_card'),
        'paypal': this.translateService.instant('add_money.paypal'),
        'dd': this.translateService.instant('add_money.direct_debit')
    };

    constructor(private navParams: NavParams, private navCtrl: NavController, private events: Events, private platform: Platform, private translateService: TranslateService, private currencyDisplay: CurrencyDisplay, private currencyService: CurrencyService) {
        this.transaction = this.navParams.get('transaction');
        this.wallet = this.navParams.get('wallet');
    
        this.tariffId = this.transaction.tariff;
        this.tariff = this.Tariffs[this.tariffId];

        this.name = this.transaction.location.name || 'UNKNOWN NAME';
        this.city = this.transaction.location.city || '';
        this.address = this.transaction.location.address || '';
        this.country = this.transaction.location.country || ''; 

    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours; 
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        return h + 'h ' + m + 'm ' + s + 's';
    }

    dismiss() {
        this.navCtrl.pop();
    }

    isResumableTx(): boolean {

      return (this.transaction.hasOrder() && this.transaction.order.status == "started" && this.transaction.type === 60);
    }

    isPayPalTx(): boolean {
      return (this.transaction.hasOrder() && this.transaction.order.type == "paypal");
    }

    resumePaymentProcess() {
      if(this.transaction.hasOrder()) {
        const redirectUrl = this.transaction.order.response.action_data.url;
        this.openUrlInApp(redirectUrl);
      }
    }

    cancelPaymentProcess() {
      const redirectUrl = this.transaction.order.response.action_data.url;
      const parts = redirectUrl.split("/");

      if (this.transaction.order.type === "cc") {
        const cancelUrl = parts.slice(0,parts.length-2).join('/') + "/payment_input_cancel/" + this.transaction.order.txid;

        this.openUrlInApp(cancelUrl).then(_ => {
          setTimeout(() => this.wallet.refreshData(), 2000);
        });
      };
    }

    openUrlInApp(url) {

      if (!(window as any).cordova) {
        window.open(url, '_blank', 'presentationstyle=pagesheet');

        return new Promise((resolve, reject) => {
          this.dismiss();
          resolve();

        })
      } else {
        let options = 'presentationstyle=fullscreen,closebuttoncaption=' + this.translateService.instant('common.close') + ',toolbar=yes,location=no,hardwareback=no'
        let browser = new InAppBrowser(url, '_blank', options);

        return new Promise((resolve, reject) => {
          browser.on('exit').subscribe(() => {
            //-- reload the user, we may have credit card IDs we need to sent next time
            this.events.publish('auth:refresh:user');
            this.dismiss();
            resolve();
          });
        });
      }
    }

    // getTariffCosts(contracttype: number): string {
    //     switch (contracttype) {
    //         case 0: {
    //             return '';
    //         }
    //         case 1: {
    //             return new CurrencyDisplay(this.currencyService).transform(this.transaction.receipt.priceperhour);
    //         }
    //         case 2: {
    //             //-- @TODO see https://github.com/slockit/sc-app/issues/342
    //             // need to change that to use locationService.getEstimatedPrice
    //             // it's ok for innog stations, now
    //             // return new CurrencyPipe('DE').transform(this.transaction.receipt.priceperkw / 100, 'EUR', true, '1.2-2') + '/kWh';
    //             return new CurrencyDisplay(this.currencyService).transform(this.transaction.receipt.priceperhour) + '/h';
    //         }
    //         case 3: {
    //             return new CurrencyDisplay(this.currencyService).transform(this.transaction.receipt.priceperkw) + '/kWh';
    //         }
    //     }
    // }

    openPdf(url) {
        /**
         * There's no easy way to display a pdf on android.
         * No build in capability in browser; safari there is.
         * Would be a bigger efford to install (and make work) all plugins needed to display a pdf on android.
         * Not worth it for now. So an andoird we sent the pdf to the default browser an "see what happens".
         */
        // let target = this.platform.is('android') ? '_system' : '_blank';
        // new InAppBrowser(url, target, 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no,enableViewportScale=yes');
    }

}
