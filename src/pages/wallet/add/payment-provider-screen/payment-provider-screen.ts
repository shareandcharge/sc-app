import {NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'payment-provider-screen',
    templateUrl: 'payment-provider-screen.html'
})
export class PaymentProviderScreenPage {
    pspUrl: any;

    constructor(private navParams: NavParams, private sanitizer: DomSanitizer) {
        this.pspUrl = sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get('pspUrl'));
    }
}