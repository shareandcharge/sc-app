import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {IntroPage} from "../intro/intro";
import {InAppBrowser} from "ionic-native";

@Component({
    selector: 'page-help',
    templateUrl: 'help.html'
})
export class HelpPage {

    constructor(private modalCtrl: ModalController) {
    }

    openFaq() {
        let url = 'https://shareandcharge.com/faq/';
        let browser = new InAppBrowser(url, '_blank', 'presentationstyle=pagesheet');
    }

    openIntro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }

    openContact() {
        let email = 'info@shareandcharge.com';
        window.open(`mailto:${email}`);
    }
}
