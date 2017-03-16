import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {IntroPage} from "../intro/intro";
import {InAppBrowser} from "ionic-native";
import {TermsOfUsePage} from "../_global/terms-of-use";
import {ConfigService} from "../../services/config.service";

@Component({
    selector: 'page-help',
    templateUrl: 'help.html'
})
export class HelpPage {

    constructor(private modalCtrl: ModalController, private configService: ConfigService ) {
    }

    openFaq() {
        let url = this.configService.get('FAQ_URL');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no');
    }

    openTermsOfUse() {
        let modal = this.modalCtrl.create(TermsOfUsePage);
        modal.present();
    }

    openIntro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }

    openContact() {
        let email = this.configService.get('CONTACT_EMAIL');
        window.open(`mailto:${email}`);
    }
}
