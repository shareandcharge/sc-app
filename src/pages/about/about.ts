import {Component} from '@angular/core';
import {IntroPage} from '../intro/intro';
import  {ModalController} from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    providers: []

})
export class AboutPage {
    constructor(private modalCtrl: ModalController) {
    }

    intro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }
}
