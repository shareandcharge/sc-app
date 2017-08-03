import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {IntroPage} from "../intro/intro";
import {InAppBrowser} from "ionic-native";
import {ConfigService} from "../../services/config.service";
import {DataProtectionPage} from "../_global/data-protection/data-protection";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-help',
    templateUrl: 'help.html'
})
export class HelpPage {

    private versionNumber: any;

    constructor(private modalCtrl: ModalController, private configService: ConfigService, private translateService: TranslateService) {
      this.versionNumber = this.configService.getVersionNumber();
    }


    openFaq() {
        let url = this.translateService.instant('documents.FAQ_URL')
        let close = this.translateService.instant('common.close');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption='+close+',toolbar=yes,location=no');
    }

    openTerms() {
        let url = this.translateService.instant('documents.TERMS_APP_URL');
        let close = this.translateService.instant('common.close');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption='+close+',toolbar=yes,location=no');
    }

    openDataProtection() {
        let modal = this.modalCtrl.create(DataProtectionPage);
        modal.present();
    }

    openIntro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }

    openContact() {
        let email = this.configService.get('CONTACT_EMAIL');
        window.open(`mailto:${email}`, '_system');
    }
}
